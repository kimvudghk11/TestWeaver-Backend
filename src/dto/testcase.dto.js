class ParameterDto {
    constructor({ name, values }) {
        this.name = name;
        this.values = values ?? [];
    }
}

// 생성 요청 DTO
class TestCaseGenerateReq {
    constructor({ projectId, name, strategy, coverage, parameters }) {
        this.projectId = projectId ?? null;
        this.name = name ?? null;

        this.strategy = strategy || "IPO";
        this.coverage = coverage || "2-way";

        this.parameters = (parameters ?? []).map(
            (p) => new ParameterDto(p)
        );
    }
}

// 응답용: 테스트 케이스 한 줄
class TestCaseRowResp {
    constructor(index, map) {
        this.index = index;
        this.values = map ?? {};
    }
}

// 응답용: 세트 전체
class TestCaseSetResp {
    constructor({ id, name, strategy, coverage, parameterCount, testCases }) {
        this.id = id;
        this.name = name;
        this.strategy = strategy;
        this.coverage = coverage;
        this.parameterCount = parameterCount;
        this.testCases = testCases;
    }
}

module.exports = {
    ParameterDto,
    TestCaseGenerateReq,
    TestCaseRowResp,
    TestCaseSetResp,
};
