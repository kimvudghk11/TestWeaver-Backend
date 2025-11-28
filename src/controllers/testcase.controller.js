const asyncHandler = require("../utils/asyncHandler");
const service = require("../services/testcase.service");

/**
 * @swagger
 * /api/v1/testcases/generate:
 *   post:
 *     summary: Generate test case set
 *     tags: [TestCases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: number
 *               strategy:
 *                 type: string
 *               coverage:
 *                 type: number
 *               parameters:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Test cases generated successfully
 */
const generate = asyncHandler(async (req, res) => {
    const data = await service.generate(req.body);
    res.status(201).json({
        success: true,
        data,
    });
});

/**
 * @swagger
 * /api/v1/testcases/{id}:
 *   get:
 *     summary: Get testcase set by ID
 *     tags: [TestCases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Test case set loaded successfully
 */
const getSet = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await service.getSet(id);
    res.json({
        success: true,
        data,
    });
});

/**
 * 파일 export (CSV / Excel)
 * GET /api/v1/testcases/:id/export?type=csv|excel|xlsx
 */
/**
 * @swagger
 * /api/v1/testcases/{id}/export:
 *   get:
 *     summary: Export test case set as CSV or Excel
 *     tags: [TestCases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [csv, excel, xlsx]
 *     responses:
 *       200:
 *         description: File exported successfully
 */
const exportFile = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const type = req.query.type || "csv";

    const { filename, mime, data } = await service.exportSet(id, type);

    res.setHeader("Content-Type", mime);
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(filename)}"`
    );
    res.send(data);
});

module.exports = {
    generate,
    getSet,
    exportFile,
};