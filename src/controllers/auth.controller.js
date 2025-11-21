const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
    const { loginId, email, name, password, phone } = req.body;
    const { user, token } = await authService.register({
        loginId, email, name, password, phone
    });

    res
        .cookie("access_token", token, {
            httpOnly: true,
            samSite: "lax",
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

const login = asyncHandler(async (req, res) => {
    const { loginId, password } = req.body;
    const { user, token } = await authService.login({ loginId, password });

    res
        .cookie("access_token", token, {
            httpOnly: true,
            samSite: "lax",
            secure: false,
        })
        .json({
            success: true,
            data: user,
        });
});

const logout = asyncHandler(async (req, res) => {
    res.clearCookie("access_token").json({
        success: true,
    });
});

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

module.exports = {
    register,
    login,
    logout,
    findId,
    resetPassword,
    changePassword,
};