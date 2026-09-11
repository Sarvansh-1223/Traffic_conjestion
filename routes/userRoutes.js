const express = require("express");
const router = express.Router();
 
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/userController");
 
const {
    authenticateToken,
    authenticateAdmin
} = require("../middleware/authMiddleware");
 
router.get(
    "/users",
    authenticateToken,
    authenticateAdmin,
    getUsers
);
 
router.get(
    "/users/:id",
    authenticateToken,
    authenticateAdmin,
    getUserById
);
 
router.put(
    "/users/:id",
    authenticateToken,
    authenticateAdmin,
    updateUser
);
 
router.delete(
    "/users/:id",
    authenticateToken,
    authenticateAdmin,
    deleteUser
);
 
module.exports = router;