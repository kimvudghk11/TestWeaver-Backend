const db = require("../config/db");

async function createProject({ name, description }) {
    const [result] = await db.execute(
        `INSERT INTO test_projects (name, description) VALUES (?, ?)`,
        [name, description ?? null]
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

async function findAll() {
    const [rows] = await db.execute(`SELECT * FROM test_projects ORDER BY id DESC`);

    return rows;
}

async function searchByName(keyword) {
    const [rows] = await db.execute(
        `SELECT * FROM test_projects WHERE LOWER(name) LIKE ? ORDER BY id DESC`,
        [`%${keyword.toLowerCase()}%`]
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