const PairwiseStrategy = require("./PairwiseStrategy");

class IPOStrategy extends PairwiseStrategy {
    generate(parameters) {
        if (!parameters || parameters.length === 0)
            return [];

        // 각 parameter.values가 비어있으면 빈 문자열로 대체
        const normalized = parameters.map(p => ({
            name: p.name,
            values: (p.values && p.values.length > 0) ? p.values : [""],
        }));

        // 재귀로 전체 조합 생성
        const result = [];

        function dfs(idx, current) {
            if (idx === normalized.length) {
                result.push({ ...current });
                return;
            }

            const param = normalized[idx];
            for ( const v of param.values) {
                current[param.name] = v;
                dfs(idx + 1, current);
            }
        }

        dfs(0, {});

        return result;
    }
}

module.exports = IPOStrategy;