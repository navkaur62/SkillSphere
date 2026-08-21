const Skill = require("../models/Skill");
const User = require("../models/user");

// CREATE SKILL
const createSkill = async (req, res) => {
    try {
        const { name, category, description } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                message: "Skill name and category are required"
            });
        }

        const existingSkill = await Skill.findOne({
            name: name.trim()
        });

        if (existingSkill) {
            return res.status(400).json({
                message: "Skill already exists"
            });
        }

        const skill = await Skill.create({
            name,
            category,
            description
        });

        res.status(201).json({
            message: "Skill created successfully",
            skill
        });

    } catch (error) {
        console.error("Create skill error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET ALL SKILLS
const getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find().sort({ name: 1 });

        res.status(200).json({
            message: "Skills fetched successfully",
            skills
        });

    } catch (error) {
        console.error("Get skills error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ADD SKILL TO USER PROFILE
const addSkillToProfile = async (req, res) => {
    try {
        const {
            skillId,
            level,
            progress,
            status,
            experience
        } = req.body;

        if (!skillId) {
            return res.status(400).json({
                message: "Skill ID is required"
            });
        }

        const skill = await Skill.findById(skillId);

        if (!skill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if skill is already added
        const alreadyAdded = user.skills.some(
            (item) => item.skill.toString() === skillId
        );

        if (alreadyAdded) {
            return res.status(400).json({
                message: "Skill already added to profile"
            });
        }

        user.skills.push({
            skill: skillId,
            level: level || "Beginner",
            progress: progress ?? 0,
            status: status || "Not Started",
            experience: experience ?? 0
        });

        await user.save();

        const updatedUser = await User.findById(req.user.userId)
            .select("-password")
            .populate("skills.skill");

        res.status(200).json({
            message: "Skill added to profile successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Add skill error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// UPDATE SKILL PROGRESS
const updateSkillProgress = async (req, res) => {
    try {
        const { skillId } = req.params;

        const {
            level,
            progress,
            status,
            experience
        } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const userSkill = user.skills.find(
            (item) => item.skill.toString() === skillId
        );

        if (!userSkill) {
            return res.status(404).json({
                message: "Skill is not in your profile"
            });
        }

        if (level !== undefined) {
            userSkill.level = level;
        }

        if (progress !== undefined) {
            userSkill.progress = progress;
        }

        if (status !== undefined) {
            userSkill.status = status;
        }

        if (experience !== undefined) {
            userSkill.experience = experience;
        }

        await user.save();

        const updatedUser = await User.findById(req.user.userId)
            .select("-password")
            .populate("skills.skill");

        res.status(200).json({
            message: "Skill progress updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update skill progress error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// REMOVE SKILL FROM USER PROFILE
const removeSkillFromProfile = async (req, res) => {
    try {
        const { skillId } = req.params;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const skillExists = user.skills.some(
            (item) => item.skill.toString() === skillId
        );

        if (!skillExists) {
            return res.status(404).json({
                message: "Skill is not in your profile"
            });
        }

        user.skills = user.skills.filter(
            (item) => item.skill.toString() !== skillId
        );

        await user.save();

        const updatedUser = await User.findById(req.user.userId)
            .select("-password")
            .populate("skills.skill");

        res.status(200).json({
            message: "Skill removed from profile successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Remove skill error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createSkill,
    getAllSkills,
    addSkillToProfile,
    updateSkillProgress,
    removeSkillFromProfile
};