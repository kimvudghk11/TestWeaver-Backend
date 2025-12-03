/**
 * @swagger
 * components:
 *   schemas:
 *     ParameterDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: "파라미터 이름 (예: OS, Browser)"
 *           example: "OS"
 *         values:
 *           type: array
 *           description: "파라미터가 가질 수 있는 값들의 목록"
 *           items:
 *             type: string
 *           example: ["Windows", "Linux", "macOS"]
 *
 *     TestCaseGenerateReq:
 *       type: object
 *       required:
 *         - projectId
 *         - name
 *       properties:
 *         projectId:
 *           type: integer
 *           description: 프로젝트 ID
 *           example: 1
 *         name:
 *           type: string
 *           description: "테스트 케이스 세트 이름"
 *           example: "로그인 페이지 테스트"
 *         strategy:
 *           type: string
 *           description: "조합 알고리즘 (IPO, IPOG 등)""
 *           enum: [IPO, IPOG]
 *           default: IPO
 *           example: "IPOG"
 *         coverage:
 *           type: string
 *           description: "커버리지 수준 (2-way, 3-way)""
 *           default: "2-way"
 *           example: "2-way"
 *         parameters:
 *           type: array
 *           description: "테스트할 파라미터 목록 (비워두면 서버에서 Faker로 랜덤 생성)""
 *           items:
 *             $ref: '#/components/schemas/ParameterDto'
 *           example:
 *             - name: "Browser"
 *               values: ["Chrome", "Firefox", "Safari"]
 *             - name: "Device"
 *               values: ["Desktop", "Mobile", "Tablet"]
 *
 *     TestCaseSetResp:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         name:
 *           type: string
 *           example: "로그인 페이지 테스트 결과"
 *         strategy:
 *           type: string
 *           example: "IPOG"
 *         testCases:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               index:
 *                 type: integer
 *               values:
 *                 type: object
 */
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
