const db = require("../config/db");

async function createProject({ userId, name, description }) {
    const [result] = await db.execute(
        `INSERT INTO test_projects (user_id, name, description) VALUES (?, ?, ?)`,
        [userId, name, description ?? null]
    );

    return await findById(result.insertId);
}

async function findById(id) {
    const [rows] = await db.execute(
        `SELECT * FROM test_projects WHERE id = ?`,
        [id]
    );

    return rows[0] ?? null;
}

async function findAll(userId) {
    const [rows] = await db.execute(`SELECT * FROM test_projects WHERE user_id = ? ORDER BY id DESC`,
        [userId]
    );

    return rows;
}

async function searchByName(userId, keyword) {
    const [rows] = await db.execute(
        `SELECT * FROM test_projects WHERE user_id = ? AND LOWER(name) LIKE ? ORDER BY id DESC`,
        [userId, `%${keyword.toLowerCase()}%`]
    );

    return rows;
}

async function updateProject(id, { name, description }) {
    await db.execute(
        `UPDATE test_projects SET name = ?, description = ? WHERE id = ?`,
        [name, description ?? null, id]
    );

    return await findById(id);
}

async function deleteProject(id) {
    await db.execute(
        `DELETE FROM test_projects WHERE id = ?`,
        [id]
    );
}

module.exports = {
    createProject,
    findById,
    findAll,
    searchByName,
    updateProject,
    deleteProject,
};