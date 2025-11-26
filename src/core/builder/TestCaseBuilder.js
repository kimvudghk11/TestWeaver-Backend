class TestCaseBuilder {

    /**
     * DB 저장용 데이터로 변환
     * rawCases = [{ OS: "MAC", Browser: "Chrome", USER: "user A" }, ...]
     */
    buildForPersistence(rawCases) {
        const result = [];

        rawCases.forEach((row, index) => {
            const params = Object.entries(row).map(([name, value]) => ({
                name,
                value: String(value)   // 🔥 값은 항상 문자열로 강제
            }));

            result.push({
                caseIndex: index,
                params
            });
        });

        return result;
    }

    /**
     * DB → 응답 데이터로 변환
     * items = rows from test_case_items
     * values = { OS: "MAC", Browser: "Chrome", USER: "user A" }
     */
    buildForResponse(items) {
        const result = {};

        items.forEach(item => {
            const index = item.case_index;

            if (!result[index]) result[index] = {};

            // 🔥 DB param_value는 이미 문자열
            result[index][item.param_name] = String(item.param_value);
        });

        // 응답 형태로 변환
        return Object.entries(result).map(([index, values]) => ({
            index: Number(index),
            values
        }));
    }
}

module.exports = TestCaseBuilder;
