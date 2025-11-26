const PairwiseStrategy = require("./PairwiseStrategy");
const {
    generatePairwise2Way,
    generatePairwise3Way
} = require("./PairwiseEngine");

class IPOStrategy extends PairwiseStrategy {
    constructor(way = 2) {
        super();
        this.way = way;
    }

    generate(parameters) {
        if (this.way === 3) {
            return generatePairwise3Way(parameters);
        }
        return generatePairwise2Way(parameters);
    }
}

module.exports = IPOStrategy;
