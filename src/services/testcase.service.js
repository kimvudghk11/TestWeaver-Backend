const { 
    TestCaseGenerateReq, 
    TestCaseSetResp,
    TestCaseRowResp,
} = require("../dto/testcase.dto");
const { createPairwiseStrategy } = require("../core/strategy/pairwise/PairwiseStrategyFactory");
const TestCaseBuilder = require("../core/builder/TestCaseBuilder");
const DefaultTestCaseValidator = require("../core/validator/DefaultTestCaseValidator");
const testCaseRepo = require("../repositories/testcase.repository");

const builder = new TestCaseBuilder();
const validator = new DefaultTestCaseValidator();

async function generate(body) {
    const reqDto = new TestCaseGenerateReq(body);
    const strategy = createPairwiseStrategy(reqDto.strategy);
    const rawCases = strategy.generate(reqDto.parameters);

    validator.validate(reqDto.parameters, rawCases);

    // DB 저장용 구조
    const builtCases = builder.buildForPersistence(rawCases);

    const setEntity = await testCaseRepo.createSet({
        projectId: reqDto.projectId,
        name: reqDto.name,
        strategy: reqDto.strategy,
        parameterCount: reqDto.parameters.length,
    });

    await testCaseRepo.insertItems(setEntity.id, builtCases);

    const respCases = builtCases.map(c => {
        const obj = {};

        for (const p of c.params) {
            obj[p.name] = p.value;
        }

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

module.exports = {
    generate,
    getSet,
};