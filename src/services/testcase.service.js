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
    // 1) 프로젝트에 해당하는 TestCaseSet 목록 가져오기
    const sets = await testCaseRepo.findSetsByProject(projectId);

    // 2) 각 세트별 items도 함께 가져오기
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
            parameterCount: s.parameter_count,
            testCases: cases
        });
    }

    return result;
}

async function generate(body) {
    const reqDto = new TestCaseGenerateReq(body);
    const strategy = createPairwiseStrategy(reqDto.strategy);

    const rawCases = strategy.generate(reqDto.parameters);

    validator.validate(reqDto.parameters, rawCases);

    const builtCases = builder.buildForPersistence(rawCases);

    const setEntity = await testCaseRepo.createSet({
        projectId: reqDto.projectId,
        name: reqDto.name || "Default Set",
        strategy: reqDto.strategy,
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
        parameterCount: setEntity.parameter_count,
        testCases: respCases,
    });
}

async function getSet(setId) {
    const setEntity = await repo.findSetById(setId);
    if (!setEntity) {
        const err = new Error("Test case set not found");
        err.status = 404;

        throw err;
    }

    const items = await repo.findItemsBySetId(setId);
    const rows = builder.buildForResponse(items).map(
        r => new TestCaseRowResp(r.index, r.values)
    );

    return new TestCaseSetResp({
        id: setEntity.id,
        name: setEntity.name,
        strategy: setEntity.strategy,
        parameterCount: setEntity.parameter_count,
        testCases: rows,
    });
}

/**
 * Export: CSV or Excel
 * @param {number} setId
 * @param {string} type 'csv' | 'excel' | 'xlsx'
 * @returns {Promise<{ filename: string, mime: string, data: Buffer }>}
 */
async function exportSet(setId, type) {
    const set = await getSet(setId);
    const exporter = createExporter(type);
    const result = await exporter.export(set.testCases);

    const t = (type || "csv").toLowerCase();
    let mime, ext;

    if (t === "xlsx" || t === "excel") {
        mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        ext = "xlsx";
    } else {
        mime = "text/csv; charset-utf-8";
        ext = "csv";
    }

    // CSV는 string, Excel은 Buffer → 통일해서 Buffer로 변환
    const data =
        typeof result === "string"
            ? Buffer.from(result, "utf8")
            : result;

    const filename = `testcases_${setId}.${ext}`;

    return {
        filename,
        mime,
        data,
    };
}

module.exports = {
    getByProject,
    generate,
    getSet,
    exportSet,
};