const express = require("express");
const router = express.Router();

const {
    createLearningPath,
    getAllLearningPaths,
    getLearningPathById,
    enrollInLearningPath
} = require("../controllers/learningPathController");

const protect = require("../middleware/authmiddleware");

// Get all learning paths
router.get("/", protect, getAllLearningPaths);

// Get single learning path
router.get("/:id", protect, getLearningPathById);

// Create learning path
router.post("/", protect, createLearningPath);

// Enroll in learning path
router.post("/:id/enroll", protect, enrollInLearningPath);

module.exports = router;