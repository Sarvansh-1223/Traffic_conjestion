const userModel = require("../models/userModel");


// ============================================================
// GET CURRENT USER
// GET /api/me
// ============================================================

const getCurrentUser = async (req, res) => {

    try {

        const user =
            await userModel.getUserById(
                req.user.user_id
            );

        if (!user) {

            return res.status(404).json({
                error: "User not found."
            });
        }

        return res.json(user);

    } catch (error) {

        console.error(
            "User information error:",
            error
        );

        return res.status(500).json({
            error:
                "Unable to retrieve user information."
        });
    }
};


// ============================================================
// GET ALL USERS
// GET /api/users
// ============================================================

const getUsers = async (req, res) => {

    try {

        const users =
            await userModel.getUsers();

        return res.json(users);

    } catch (error) {

        console.error(
            "Get users error:",
            error
        );

        return res.status(500).json({
            error:
                "Unable to retrieve users."
        });
    }
};


// ============================================================
// GET USER BY ID
// GET /api/users/:id
// ============================================================

const getUserById = async (req, res) => {

    try {

        const { id } = req.params;

        const user =
            await userModel.getUserById(id);

        if (!user) {

            return res.status(404).json({
                error: "User not found."
            });
        }

        return res.json(user);

    } catch (error) {

        console.error(
            "Get user error:",
            error
        );

        return res.status(500).json({
            error:
                "Unable to retrieve user."
        });
    }
};


// ============================================================
// UPDATE USER
// PUT /api/users/:id
// ============================================================

const updateUser = async (req, res) => {

    try {

        const { id } = req.params;

        const existingUser =
            await userModel.getUserById(id);

        if (!existingUser) {

            return res.status(404).json({
                error: "User not found."
            });
        }

        const result =
            await userModel.updateUser(
                id,
                req.body
            );

        if (!result) {

            return res.status(400).json({
                error:
                    "No valid fields provided for update."
            });
        }

        const updatedUser =
            await userModel.getUserById(id);

        return res.json({
            message:
                "User updated successfully.",
            user: updatedUser
        });

    } catch (error) {

        console.error(
            "Update user error:",
            error
        );

        return res.status(500).json({
            error:
                "Unable to update user."
        });
    }
};


// ============================================================
// DELETE USER
// DELETE /api/users/:id
// ============================================================

const deleteUser = async (req, res) => {

    try {

        const { id } = req.params;

        const existingUser =
            await userModel.getUserById(id);

        if (!existingUser) {

            return res.status(404).json({
                error: "User not found."
            });
        }

        await userModel.deleteUser(id);

        return res.json({
            message:
                "User deleted successfully."
        });

    } catch (error) {

        console.error(
            "Delete user error:",
            error
        );

        return res.status(500).json({
            error:
                "Unable to delete user."
        });
    }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getCurrentUser,

    getUsers,

    getUserById,

    updateUser,

    deleteUser

};