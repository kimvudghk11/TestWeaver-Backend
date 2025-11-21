const asyncHandler = require("../utils/asyncHandler");
const service = require("../services/testcase.service");

const generate = asyncHandler(async (req, res) => {
    const data = await service.generate(req.body);
    res.status(201).json({
        success: true,
        data,
    });
});

const getSet = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await service.getSet(id);
    res.json({
        success: true,
        data,
    });
});

module.exports = {
    generate,
    getSet,
};