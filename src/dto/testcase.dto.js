class ParameterDto {
    constructor({ name, values }) {
        this.name = name;
        this.values = values ?? [];
    }
}

// 생성 요청 DTO
class TestCaseGenerateReq {
    constructor({ projectId, name, strategy, parameters }) {
        this.projectId = projectId ?? null;
        this.name = name;
        this.strategy = strategy || "IPO";
        this.parameters = (parameters ?? []).map(p => new ParameterDto(p));
    }
}

// 응답용: 테스트 케이스 한줄
class TestCaseRowResp {
    constructor (index, map) {
        this.index = index;
        this.values = map; // { paramName: value }
    }
}

// 응답용: 세트 전체
class TestCaseSetResp {
    constructor({ id, name, strategy, parameterCount, testCase }) {
        this.id = id;
        this.name= name;
        this.strategy = strategy;
        this.parameterCount = parameterCount;
        this.testCase = testCase // TestCaseRowResp[]
    }
}

module.exports = {
    ParameterDto,
    TestCaseGenerateReq,
    TestCaseRowResp,
    TestCaseSetResp,
};