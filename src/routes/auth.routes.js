const express = require("express");
const router = express.Router();

const authCtrl = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");
const validateRequest = require("../middlewares/validateRequest");
const {
    registerValidation,
    loginValidation,
    findIdValidation,
    resetPasswordValidation,
    changePasswordValidation,
} = require("../core/validator/auth.validator");

// 회원가입
router.post("/register", registerValidation, validateRequest, authCtrl.register);

// 로그인
router.post("/login", loginValidation, validateRequest, authCtrl.login);

// 로그아웃
router.post("/logout", authCtrl.logout);

// 아이디 찾기
router.post("/find-id", findIdValidation, validateRequest, authCtrl.findId);

// 비밀번호 찾기 + 재설정
router.post("/reset-password", resetPasswordValidation, validateRequest, authCtrl.resetPassword);

//(로그인 상태) 비밀번호 변경
router.post("/change-password", auth, changePasswordValidation, validateRequest, authCtrl.changePassword);

// 로그인 상태 확인
router.get("/me", auth, authCtrl.me);

module.exports = router;