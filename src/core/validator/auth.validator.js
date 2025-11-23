const { body } = require("express-validator");

const registerValidation = [
    body("loginId").trim().notEmpty().withMessage("Login ID is required"),
    body("email").trim().isEmail().withMessage("Valid email is required"),
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
];

const loginValidation = [
    body("loginId").trim().notEmpty().withMessage("Login ID is required"),
    body("password").notEmpty().withMessage("Password is required"),
];

const findIdValidation = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Valid email is required"),
];

const resetPasswordValidation = [
    body("loginId").trim().notEmpty().withMessage("Login ID is required"),
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Valid email is required"),
    body("newPassword")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters"),
];

const changePasswordValidation = [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters"),
];

module.exports = {
    registerValidation,
    loginValidation,
    findIdValidation,
    resetPasswordValidation,
    changePasswordValidation,
};