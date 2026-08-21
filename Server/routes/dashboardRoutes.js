const express = require("express");
const router = express.Router();

const { getDashboard } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authmiddleware");

// Get dashboard data
router.get("/", authMiddleware, getDashboard);

module.exports = router;