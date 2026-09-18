const express = require("express");

const {
    createSkill,
    getAllSkills,
    getMySkills,
    addSkillToProfile,
    updateSkillProgress,
    removeSkillFromProfile
} = require("../controllers/skillController");

const protect = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/", protect, createSkill);

router.get("/", protect, getAllSkills);

router.get("/my-skills", protect, getMySkills);

router.post("/add", protect, addSkillToProfile);

router.put("/progress/:skillId", protect, updateSkillProgress);

router.delete("/remove/:skillId", protect, removeSkillFromProfile);

module.exports = router;