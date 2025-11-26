const {
    TestCaseGenerateReq,
    TestCaseSetResp,
    TestCaseRowResp,
} = require("../dto/testcase.dto");

const { createPairwiseStrategy } = require("../core/strategy/pairwise/PairwiseStrategyFactory");

const TestCaseBuilder = require("../core/builder/TestCaseBuilder");
const DefaultTestCaseValidator = require("../core/validator/DefaultTestCaseValidator");

const testCaseRepo = require("../repositories/testcase.repository");
const { createExporter } = require("../core/export/ExporterFactory");

const builder = new TestCaseBuilder();
const validator = new DefaultTestCaseValidator();

async function getByProject(projectId) {
    const sets = await testCaseRepo.findSetsByProject(projectId);

    const result = [];

    for (const s of sets) {
        const items = await testCaseRepo.findItemsBySetId(s.id);

        const cases = items.reduce((acc, item) => {
            if (!acc[item.case_index]) acc[item.case_index] = {};
            acc[item.case_index][item.param_name] = item.param_value;
            return acc;
        }, []);

        result.push({
            id: s.id,
            name: s.name,
            strategy: s.strategy,
            coverage: s.coverage,
            parameterCount: s.parameter_count,
            testCases: cases,
        });
    }

    return result;
}

async function generate(body) {
    const reqDto = new TestCaseGenerateReq(body);

    const strategy = createPairwiseStrategy(reqDto.strategy, reqDto.coverage);

    const rawCases = strategy.generate(reqDto.parameters);

    validator.validate(reqDto.parameters, rawCases);

    const builtCases = builder.buildForPersistence(rawCases);

    // 자동 세트 이름 생성
    const paramNames = reqDto.parameters.map(p => p.name);
    const autoName = `${reqDto.strategy} ${reqDto.coverage} - ${paramNames.join(", ")}`;

    const setEntity = await testCaseRepo.createSet({
        projectId: reqDto.projectId,
        name: autoName,
        strategy: reqDto.strategy,
        coverage: reqDto.coverage,
        parameterCount: reqDto.parameters.length,
    });

    await testCaseRepo.insertItems(setEntity.id, builtCases);

    const respCases = builtCases.map(c => {
        const obj = {};
        for (const p of c.params) obj[p.name] = p.value;
        return new TestCaseRowResp(c.caseIndex, obj);
    });

    return new TestCaseSetResp({
        id: setEntity.id,
        name: setEntity.name,
        strategy: setEntity.strategy,
        coverage: setEntity.coverage,
        parameterCount: setEntity.parameter_count,
        testCases: respCases,
    });
}

async function getSet(setId) {
    const setEntity = await testCaseRepo.findSetById(setId);
    if (!setEntity) {
        const err = new Error("Test case set not found");
        err.status = 404;
        throw err;
    }

    const items = await testCaseRepo.findItemsBySetId(setId);

    const rows = builder.buildForResponse(items).map(
        r => new TestCaseRowResp(r.index, r.values)
    );

    return new TestCaseSetResp({
        id: setEntity.id,
        name: setEntity.name,
        strategy: setEntity.strategy,
        coverage: setEntity.coverage,
        parameterCount: setEntity.parameter_count,
        testCases: rows,
    });
}

async function exportSet(setId, type) {
    const set = await getSet(setId);

    // 🔥 builder에서 이미 values는 string-only임
    const flatCases = set.testCases.map(tc => {
        const row = { No: tc.index + 1 };

        for (const [k, v] of Object.entries(tc.values)) {
            row[k] = v ?? "";
        }

        return row;
    });

    if (!flatCases.length) {
        throw new Error("No test case data for export.");
    }

    const exporter = createExporter(type);
    const result = await exporter.export(flatCases);

    const ext = type === "excel" ? "xlsx" : "csv";
    const mime = type === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv; charset=utf-8";

    const safeName = set.name.replace(/[^a-zA-Z0-9가-힣,\-\s]/g, "_");

    return {
        filename: `${safeName}.${ext}`,
        mime,
        data: Buffer.isBuffer(result)
            ? result
            : Buffer.from(result, "utf-8"),
    };
}

module.exports = {
    getByProject,
    generate,
    getSet,
    exportSet,
};
