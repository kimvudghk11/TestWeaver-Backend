const asyncHandler = require("../utils/asyncHandler");
const projectService = require("../services/project.service");

const create = asyncHandler(async (req, res) => {
    const data = await projectService.create(req.body);

    res.status(201).json({ success: true, data });
});

const list = asyncHandler(async (req, res) => {
    const q = req.query.q ?? "";
    const data = await projectService.list(q);

    res.json({ success: true, data });
});

const detail = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await projectService.detail(id);

    res.json({ success: true, data });
});

const update = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await projectService.update(id, req.body);

    res.json({ success: true, data });
});

const remove = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await projectService.remove(id);

    res.json({ success: true, data });
});

module.exports = {
    create,
    list,
    detail,
    update,
    remove,
};