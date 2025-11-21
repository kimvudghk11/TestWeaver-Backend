/**
 * 인터페에시으 느낌: 모든 Pairwise 전략은 generate를 구현
 * parameters: ParameterDto[] (name, values[])
 */

class PairwiseStrategy {
    /**
    * @param {Array<{name: string, values: string[]}>} parameters
    * @returns {Array<Object>} [{paramName: value, ... }, ...]
    */

    TestCaseGenerateReq(parameters) {
        throw new Error("generate() must be implemented");
    }
}

module.exports = PairwiseStrategy;