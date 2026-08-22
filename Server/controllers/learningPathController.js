const LearningPath = require("../models/learningPath");
const User = require("../models/user");

// CREATE LEARNING PATH
const createLearningPath = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            level,
            skills,
            duration
        } = req.body;

        if (!title || !description || !category || !duration) {
            return res.status(400).json({
                success: false,
                message: "Title, description, category and duration are required"
            });
        }

        const learningPath = await LearningPath.create({
            title,
            description,
            category,
            level,
            skills,
            duration,
            createdBy: req.user.userId
        });

        res.status(201).json({
            success: true,
            message: "Learning path created successfully",
            learningPath
        });

    } catch (error) {
        console.error("Create learning path error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while creating learning path"
        });
    }
};


// GET ALL LEARNING PATHS
const getAllLearningPaths = async (req, res) => {
    try {
        const learningPaths = await LearningPath.find()
            .populate("skills", "name category description")
            .populate("createdBy", "name email");

        res.status(200).json({
            success: true,
            count: learningPaths.length,
            learningPaths
        });

    } catch (error) {
        console.error("Get learning paths error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching learning paths"
        });
    }
};


// GET SINGLE LEARNING PATH
const getLearningPathById = async (req, res) => {
    try {
        const learningPath = await LearningPath.findById(req.params.id)
            .populate("skills", "name category description")
            .populate("createdBy", "name email");

        if (!learningPath) {
            return res.status(404).json({
                success: false,
                message: "Learning path not found"
            });
        }

        res.status(200).json({
            success: true,
            learningPath
        });

    } catch (error) {
        console.error("Get learning path error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching learning path"
        });
    }
};


// ENROLL USER IN LEARNING PATH
const enrollInLearningPath = async (req, res) => {
    try {
        const learningPath = await LearningPath.findById(req.params.id);

        if (!learningPath) {
            return res.status(404).json({
                success: false,
                message: "Learning path not found"
            });
        }

        // Get logged-in user using userId from JWT
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if already enrolled
        if (learningPath.enrolledUsers.includes(user._id)) {
            return res.status(400).json({
                success: false,
                message: "You are already enrolled in this learning path"
            });
        }

        // Add learning path to user's profile
        user.learningPaths.push(learningPath._id);

        // Add user to learning path
        learningPath.enrolledUsers.push(user._id);

        await learningPath.save();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Successfully enrolled in learning path"
        });

    } catch (error) {
        console.error("Enroll learning path error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while enrolling in learning path"
        });
    }
};


module.exports = {
    createLearningPath,
    getAllLearningPaths,
    getLearningPathById,
    enrollInLearningPath
};