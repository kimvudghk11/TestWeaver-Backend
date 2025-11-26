const db = require("../config/db");

async function createSet({ projectId, name, strategy, coverage, parameterCount }) {
    const [result] = await db.execute(
        `INSERT INTO test_case_sets (project_id, name, strategy, coverage, parameter_count)
        VALUES (?, ?, ?, ?, ?)`,
        [projectId, name, strategy, coverage, parameterCount]
    );

    const id = result.insertId;
    const [rows] = await db.execute(
        `SELECT * FROM test_case_sets WHERE id = ?`,
        [id]
    );

    return rows[0];
}

async function insertItems(setId, builtCases) {
    const values = [];

    for (const row of builtCases) {
        for (const p of row.params) {
            values.push([
                setId,
                row.caseIndex,
                p.name,
                p.value,
            ]);
        }
    }

    if (values.length === 0) return;

    await db.query(
        `INSERT INTO test_case_items
        (set_id, case_index, param_name, param_value)
        VALUES ?`,
        [values]
    );
}

async function findSetById(id) {
    const [rows] = await db.execute(
        `SELECT * FROM test_case_sets WHERE id = ?`,
        [id]
    );

    return rows[0] ?? null;
}

async function findItemsBySetId(setId) {
    const [rows] = await db.execute(
        `SELECT * FROM test_case_items
        WHERE set_id = ?
        ORDER BY case_index ASC, id ASC`,
        [setId]
    );

    return rows;
}

async function findSetsByProject(projectId) {
    const [rows] = await db.execute(
        `SELECT * FROM test_case_sets
        WHERE project_id = ?
        ORDER BY id DESC`,
        [projectId]
    );

    return rows;
}

module.exports = {
    createSet,
    insertItems,
    findSetById,
    findItemsBySetId,
    findSetsByProject,
};
