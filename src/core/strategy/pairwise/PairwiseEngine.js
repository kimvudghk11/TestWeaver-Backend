/** 공통 도메인 보정 */
function normalizeDomains(parameters) {
    return parameters.map(p => {
        const vals = (p.values || []).map(v => String(v));
        return vals.length > 0 ? vals : [""];  // 빈 도메인 방지
    });
}

/** ===============================
 *  2-WAY IPO (기존 generatePairwise)
 * =============================== */
function generatePairwise2Way(parameters) {
    const names = parameters.map(p => p.name);
    const domains = normalizeDomains(parameters);
    const n = parameters.length;

    if (n === 0) return [];
    if (n === 1)
        return domains[0].map(v => ({ [names[0]]: v }));

    const makeKey = (i, vi, j, vj) => JSON.stringify([i, vi, j, vj]);

    const uncovered = new Set();
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            for (const vi of domains[i]) {
                for (const vj of domains[j]) {
                    uncovered.add(makeKey(i, vi, j, vj));
                }
            }
        }
    }

    const rows = [];

    for (const v0 of domains[0]) {
        for (const v1 of domains[1]) {
            const row = new Array(n).fill(null);
            row[0] = v0;
            row[1] = v1;
            rows.push(row);
            uncovered.delete(makeKey(0, v0, 1, v1));
        }
    }

    for (let k = 2; k < n; k++) {
        for (const row of rows) {
            let bestVal = null;
            let bestGain = -1;

            for (const v of domains[k]) {
                let gain = 0;
                for (let j = 0; j < k; j++) {
                    const vi = row[j];
                    if (vi == null) continue;
                    const key = makeKey(j, vi, k, v);
                    if (uncovered.has(key)) gain++;
                }
                if (gain > bestGain) {
                    bestGain = gain;
                    bestVal = v;
                }
            }

            if (bestVal == null) bestVal = domains[k][0];
            row[k] = bestVal;

            for (let j = 0; j < k; j++) {
                const key = makeKey(j, row[j], k, bestVal);
                uncovered.delete(key);
            }
        }

        for (const keyStr of Array.from(uncovered)) {
            const [i, vi, j, vj] = JSON.parse(keyStr);
            if (j !== k) continue;

            let target = null;
            for (const row of rows) {
                if (row[i] === vi && (row[k] == null || row[k] === vj)) {
                    target = row;
                    break;
                }
            }

            if (!target) {
                const newRow = new Array(n).fill(null);
                for (let t = 0; t < k; t++) {
                    newRow[t] = domains[t][0];
                }
                newRow[i] = vi;
                newRow[k] = vj;
                rows.push(newRow);
                target = newRow;
            } else {
                target[k] = vj;
            }

            const valK = target[k];
            for (let t = 0; t < k; t++) {
                const key2 = makeKey(t, target[t], k, valK);
                uncovered.delete(key2);
            }
        }
    }

    return rows.map(row => {
        const obj = {};
        for (let idx = 0; idx < n; idx++) {
            obj[names[idx]] = row[idx];
        }
        return obj;
    });
}

/** 3-WAY IPO */
function generatePairwise3Way(parameters) {
    const names = parameters.map(p => p.name);
    const domains = normalizeDomains(parameters);

    const results = [];

    function cartesian(level, row) {
        if (level === parameters.length) {
            const obj = {};
            names.forEach((n, i) => obj[n] = row[i]);
            results.push(obj);
            return;
        }

        for (const v of domains[level]) {
            row[level] = v;
            cartesian(level + 1, row);
        }
    }

    cartesian(0, []);
    return results;
}

/** IPOG 2-WAY */
function generatePairwise2WayIPOG(parameters) {
    return generatePairwise2Way(parameters);
}

/** IPOG 3-WAY */
function generatePairwise3WayIPOG(parameters) {
    return generatePairwise3Way(parameters);
}

module.exports = {
    generatePairwise2Way,
    generatePairwise3Way,
    generatePairwise2WayIPOG,
    generatePairwise3WayIPOG,
};
