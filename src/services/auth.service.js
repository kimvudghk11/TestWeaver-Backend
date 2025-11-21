const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const userRepo = require("../repositories/user.repository");

const SALT_ROUNDS = 12;

function signToken(user) {
    const payload = { sub: user.id, loginId: user.login_id || user.loginId }
    
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
}

async function register({ loginId, email, name, password, phone }) {
    const existByhLoginId = await userRepo.findByLoginId(loginId);
    if (existByhLoginId) {
        const err = new Error("Login ID already in use");
        err.status = 400;

        throw err;
    }

    const existByEmail = await userRepo.findByEmail(email);
    if (existByEmail) {
        const err = new Error("Email already in use");
        err.status = 400;

        throw err;
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userRepo.createUser({
        loginId, email, name, passwordHash: hash, phone,
    });

    const token = signToken({ id: user.id, loginId });

    return { user, token };
}

async function login({ loginId, password }) {
    const user = await userRepo.findByLoginId(loginId);
    if (!user) {
        const err = new Error("Invalid login ID or password");
        err.status = 401;

        throw err;
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
        const err = new Error("Invalid login ID or password");
        err.status = 401;

        throw err;
    }

    const token = signToken(user);

    return { user: { id: user.id, loginId: user.login_id, name: user.name }, token};
}

async function findLoginId({ name, email }) {
    const user = await userRepo.findByNameAndEmail(name, email);
    if (!user) {
        const err = new Error("No user found with given name and email");
        err.status = 404;

        throw err;
    }

    const rawId = user.login_id;
    const masked =
        rawId.length <= 3
            ? rawId[0] + "*".repeat(rawId.length - 1)
            : rawId.substring(0, 3) + "*".repeat(rawId.length - 3);

    return { loginId: rawId, maskedLoginId: masked };
}

async function resetPasswordByInfo({ loginId, name, email, newPassword }) {
    const user = await userRepo.findByLoginIdNameEmail(loginId, name, email);
    if (!user) {
        const err = new Error("User info does not match");
        err.status = 404;

        throw err;
    }

    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await userRepo.updatePassword(user.id, hash);

    return { success: true };
}

async function changePassword({ userId, oldPassword, newPassword }) {
    const user = await userRepo.findById(userId);
    if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        throw err;
    }

    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) {
        const err = new Error("Old password is incorrect");
        err.status = 400;
        throw err;
    }

    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await userRepo.updatePassword(user.id, hash);

    return { success: true };
}

module.exports = {
    register,
    login,
    findLoginId,
    resetPasswordByInfo,
    changePassword,
};