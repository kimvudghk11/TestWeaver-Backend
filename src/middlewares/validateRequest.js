const { validationResult } = require("express-validator");

function validateRequest(req, res, next) {
    const errors = validateResult(req);

    if(errors.isEmpty())
        return next;

    const first = errors.array()[0];
    const err = new Error(`${first.param}: ${first.msg}`);

    err.status = 400;

    return next(err);
}

module.exports = validateRequest;