const asyncHandler = require("../utils/asyncHandler");
const projectService = require("../services/project.service");

const testcaseService = require("../services/testcase.service");

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

const generateModel = asyncHandler(async (req, res) => {
    const projectId = req.params.id;

    const body = {
        projectId,
        strategy: req.body.strategy,
        coverage: req.body.coverage,
        parameters: req.body.parameters
    };

    const testCaseSet = await testcaseService.generate(body);

    res.json({ success: true, data: testCaseSet });
});

const getTestCases = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const testCases = await testcaseService.getByProject(projectId);
    res.json({ success: true, data: testCases });
});

module.exports = {
    create,
    list,
    detail,
    update,
    remove,
    generateModel,
    getTestCases,
};