const IPOStrategy = require("./IPOStrategy");
const IPOGStrategy = require("./IPOGStrategy");

function createPairwiseStrategy(type) {
    const t = (type || "IPO").toUpperCase();

    switch (t) {
        case "IPOG":
            return new IPOGStrategy();
        case "IPO":
        default:
            return new IPOStrategy();
    }
}

module.exports = { createPairwiseStrategy, };