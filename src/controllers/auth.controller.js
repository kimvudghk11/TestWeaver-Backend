const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loginId:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
const register = asyncHandler(async (req, res) => {
    const { loginId, email, name, password, phone } = req.body;
    const { user, token } = await authService.register({
        loginId, email, name, password, phone
    });

    res
        .cookie("access_token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        })
        .status(201)
        .json({
            success: true,
            data: {
                id: user.id,
                loginId: user.loginId,
                email: user.email,
                name: user.name,
            },
        });
});

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login with ID and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loginId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
const login = asyncHandler(async (req, res) => {
    const { loginId, password } = req.body;
    const { user, token } = await authService.login({ loginId, password });

    res
        .cookie("access_token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        })
        .json({
            success: true,
            data: user,
        });
});

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
const logout = asyncHandler(async (req, res) => {
    res.clearCookie("access_token").json({
        success: true,
    });
});

/**
 * @swagger
 * /api/v1/auth/find-id:
 *   post:
 *     summary: Find Login ID by name and email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login ID found successfully
 */
const findId = asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    const result = await authService.findLoginId({ name, email });

    res.json({
        success: true,
        data: {
            maskedLoginId: result.maskedLoginId,
            loginId: result.loginId,
        },
    });
});

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password without login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loginId:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
const resetPassword = asyncHandler(async (req, res) => {
    const { loginId, name, email, newPassword } = req.body;
    await authService.resetPasswordByInfo({
        loginId,
        name,
        email,
        newPassword,
    });

    res.json({
        success: true,
    });
});

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Change password (requires login)
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
const changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    await authService.changePassword({
        userId,
        oldPassword,
        newPassword,
    });

    res.json({
        success: true,
    });
});

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get logged-in user's info
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User info loaded successfully
 */
const me = asyncHandler(async (req, res) => {
    const user = req.user;

    res.json({
        success: true,
        data: user,
    });
});

module.exports = {
    register,
    login,
    logout,
    findId,
    resetPassword,
    changePassword,
    me,
};