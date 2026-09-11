const db = require("../config/database");


// ============================================================
// FIND USER BY EMAIL
// ============================================================

async function findUserByEmail(email) {

    const [rows] = await db.execute(
        `
        SELECT
            id,
            user_id,
            name,
            email,
            password_hash,
            status,
            blocked_until,
            role
        FROM users
        WHERE email = ?
        `,
        [email]
    );

    return rows[0] || null;
}


// ============================================================
// CREATE USER
// ============================================================

async function createUser(user) {

    const [result] = await db.execute(
        `
        INSERT INTO users
        (
            user_id,
            name,
            email,
            password_hash,
            status
        )
        VALUES (?, ?, ?, ?, 'ACTIVE')
        `,
        [
            user.user_id,
            user.name,
            user.email,
            user.password_hash
        ]
    );

    return result;
}


// ============================================================
// GET ALL USERS
// ============================================================

async function getUsers() {

    const [rows] = await db.execute(
        `
        SELECT
            id,
            user_id,
            name,
            email,
            status,
            blocked_until,
            role
        FROM users
        ORDER BY id DESC
        `
    );

    return rows;
}


// ============================================================
// GET USER BY ID
// ============================================================

async function getUserById(id) {

    const [rows] = await db.execute(
        `
        SELECT
            id,
            user_id,
            name,
            email,
            status,
            blocked_until,
            role
        FROM users
        WHERE id = ?
        `,
        [id]
    );

    return rows[0] || null;
}


// ============================================================
// UPDATE USER
// ============================================================

async function updateUser(id, user) {

    const fields = [];
    const values = [];

    if (user.name !== undefined) {
        fields.push("name = ?");
        values.push(user.name);
    }

    if (user.email !== undefined) {
        fields.push("email = ?");
        values.push(user.email);
    }

    if (user.status !== undefined) {
        fields.push("status = ?");
        values.push(user.status);
    }

    if (user.role !== undefined) {
        fields.push("role = ?");
        values.push(user.role);
    }

    if (user.blocked_until !== undefined) {
        fields.push("blocked_until = ?");
        values.push(user.blocked_until);
    }

    if (fields.length === 0) {
        return null;
    }

    values.push(id);

    const [result] = await db.execute(
        `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE id = ?
        `,
        values
    );

    return result;
}


// ============================================================
// DELETE USER
// ============================================================

async function deleteUser(id) {

    const [result] = await db.execute(
        `
        DELETE FROM users
        WHERE id = ?
        `,
        [id]
    );

    return result;
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    findUserByEmail,

    createUser,

    getUsers,

    getUserById,

    updateUser,

    deleteUser

};