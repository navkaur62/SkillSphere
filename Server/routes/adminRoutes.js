const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    getAdminStats
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authmiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get all users - Admin only
router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getAllUsers
);

// Get admin statistics - Admin only
router.get(
    "/stats",
    authMiddleware,
    adminMiddleware,
    getAdminStats
);

module.exports = router;
