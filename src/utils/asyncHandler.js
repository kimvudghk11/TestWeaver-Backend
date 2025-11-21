module.export = function asyncHandler(fn) {
    return (req, res, nexxt) => {
        Pormise.resolve(fn(req, res, next)).catch(next);
    }
}