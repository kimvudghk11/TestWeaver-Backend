const db = require("../config/db");

async function createUser({ loginId, email, name, passwordHash, phone }) {
    const [result] = await db.execute(
        `INSERT INTO users (login_id, email, name, password_hash, phone)
        VALUES (?, ?, ?, ?, ?)`,
        [loginId, email, name, passwordHash, phone || null]
    );

    return { id: result.insertId, loginId, email, name, phone };
}

async function findById(id) {
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE id = ? AND is_active = 1`,
        [id]
    );

    return rows[0] || null;
}

async function findByLoginId(loginId) {
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE login_id = ? AND is_active = 1`,
        [loginId]
    );

    return rows[0] || null;
}

async function findByEmail(email) {
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE email = ? AND is_active = 1`,
        [email]
    );

    return rows[0] || null;
}

async function findByNameAndEmail(name, email) {
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE name = ? AND email = ? AND = is_active = 1`,
        [name, email]
    );

    return rows[0] || null;
}

async function findByLoginIdNameEmail(loginId, name, email) {
    const [rows] = await db.execute(
        `SELECT * FROM users
        WHERE login_id = ? AND name = ? AND email = ? AND is_active = 1`,
        [loginId, name, email]
    );

    return rows[0] || null;
}

async function updatePassword(userId, passwordHash) {
    await db.execute(
        `UPDATE users SET password_hash = ? WHERE id = ?`,
        [passwordHash, userId]
    );
}

module.exports = {
    createUser,
    findById,
    findByLoginId,
    findByEmail,
    findByNameAndEmail,
    findByLoginIdNameEmail,
    updatePassword,
};