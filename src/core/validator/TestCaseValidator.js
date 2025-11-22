class TestCaseValidator {
    validate(parameters, rawCases) {
        this.validateParameters(parameters);
        this.validateGeneratedCases(rawCases);
        this.validateCustom(parameters, rawCases);
    }

    /** 공통 파라미터 검증 */
    validateParameters(parameters) {
        if (!Array.isArray(parameters) || parameters.length === 0) {
            const err = new Error("At least one parameter is required");
            err.status = 400;

            throw err;
        }

        for (const p of parameters) {
            if (!p.name || typeof p.name !== "string") {
                const err = new Error("Parameter name is required");
                err.status = 400;

                throw err;
            }

            if (!Array.isArray(p.values) || p.values.length === 0) {
                const err = new Error(`Parameter "${p.name}" must have at least one value`);
                err.status = 400;

                throw err;
            }
        }
    }

    /** 공통 케이스 검증 (빈 배열 체크 등) */
    validateGeneratedCases(rawCases) {
        if (!Array.isArray(rawCases) || rawCases.length === 0) {
            const err = new Error("No test cases generated");
            err.status = 500;

            throw err;
        }
    }

    /** 도메인별 커스텀 검증 hook */
    // 하위 클래스에서 override
    validateCustom(parameters, rawCases) {

    }
}
module.exports = TestCaseValidator;