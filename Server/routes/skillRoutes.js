const express = require("express");

const {
    createSkill,
    getAllSkills,
    addSkillToProfile,
    removeSkillFromProfile
} = require("../controllers/skillController");

const protect = require("../middleware/authmiddleware");

const router = express.Router();

// Create a skill
router.post("/", protect, createSkill);

// Get all skills
router.get("/", protect, getAllSkills);

// Add skill to logged-in user's profile
router.post("/add", protect, addSkillToProfile);

// Remove skill from logged-in user's profile
router.delete("/remove/:skillId", protect, removeSkillFromProfile);

module.exports = router;