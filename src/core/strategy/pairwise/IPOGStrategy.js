const PairwiseStrategy = require("./PairwiseStrategy");
const {
    generatePairwise2WayIPOG,
    generatePairwise3WayIPOG
} = require("./PairwiseEngine");

class IPOGStrategy extends PairwiseStrategy {
    constructor(way = 2) {
        super();
        this.way = way;
    }

    generate(parameters) {
        if (this.way === 3) {
            return generatePairwise3WayIPOG(parameters);
        }
        return generatePairwise2WayIPOG(parameters);
    }
}

module.exports = IPOGStrategy;
