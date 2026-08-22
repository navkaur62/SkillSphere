const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createGoal,
    getMyGoals,
    getGoalById,
    updateGoal,
    deleteGoal
} = require("../controllers/goalController");

// Create a goal
router.post("/", protect, createGoal);

// Get my goals
router.get("/", protect, getMyGoals);

// Get single goal
router.get("/:id", protect, getGoalById);

// Update goal
router.put("/:id", protect, updateGoal);

// Delete goal
router.delete("/:id", protect, deleteGoal);

module.exports = router;