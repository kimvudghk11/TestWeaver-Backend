const asyncHandler = require("../utils/asyncHandler");
const projectService = require("../services/project.service");

const testcaseService = require("../services/testcase.service");

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     summary: Create new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 */
const create = asyncHandler(async (req, res) => {
    const data = await projectService.create(req.body);

    res.status(201).json({ success: true, data });
});

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     summary: Get list of projects
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Project list loaded successfully
 */
const list = asyncHandler(async (req, res) => {
    const q = req.query.q ?? "";
    const data = await projectService.list(q);

    res.json({ success: true, data });
});

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   get:
 *     summary: Get project detail
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Project detail loaded successfully
 */
const detail = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await projectService.detail(id);

    res.json({ success: true, data });
});

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 */
const update = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await projectService.update(id, req.body);

    res.json({ success: true, data });
});

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Project deleted successfully
 */
const remove = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await projectService.remove(id);

    res.json({ success: true, data });
});

/**
 * @swagger
 * /api/v1/projects/{id}/generate:
 *   post:
 *     summary: Generate test cases from project parameters
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               strategy:
 *                 type: string
 *               coverage:
 *                 type: number
 *               parameters:
 *                 type: array
 *                 items:
 *                   type: object
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *     responses:
 *       200:
 *         description: Test cases generated successfully
 */
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

/**
 * @swagger
 * /api/v1/projects/{id}/testcases:
 *   get:
 *     summary: Get test cases for project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *     responses:
 *       200:
 *         description: Test cases loaded successfully
 */
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