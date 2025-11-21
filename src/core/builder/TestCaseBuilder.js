class TestCaseBuilder {
    /**
     * rawCase: [{ paramA: "1", paramB: "Y", ...}, ...]
     * @returns {Array<{ caseIndex: number, params: Array<{name, value}>}>}
     */

    buildForPersistence(rawCases) {
        return rawCases.map((row, idx) => {
            const params = Object.entries(row).map(([name, value]) => ({
                name,
                value,
            }));
            
            return {
                caseIndex: idx,
                params,
            };
        });
    }

    buildForResponse(items) {
        const byIndex = new Map();

        for (const item of items) {
            if (!byIndex.has(item.case_index)) {
                byIndex.set(item.case_index, {});
            }
            const map = byIndex.get(item.case_index);
            map[item.param_name] = item.param_value;
        }

        return Array.from(byIndex.entries())
            .sort((a, b) => a[0] - b[0])
            .map((idx, map) => ({
                index: idx,
                values: map,
            }));
    }
}

module.exports = TestCaseBuilder;