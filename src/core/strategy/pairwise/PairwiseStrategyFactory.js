const IPOStrategy = require("./IPOStrategy");
const IPOGStrategy = require("./IPOGStrategy");

/**
 * @param {"IPO"|"IPOG"} type 
 * @param {"2-way"|"3-way"} coverage
 */
function createPairwiseStrategy(type, coverage) {
    const way = Number(String(coverage).charAt(0)); // "2-way" → 2

    if (type === "IPO") return new IPOStrategy(way);
    if (type === "IPOG") return new IPOGStrategy(way);

    throw new Error(`Invalid strategy: ${type}`);
}

module.exports = { createPairwiseStrategy };
