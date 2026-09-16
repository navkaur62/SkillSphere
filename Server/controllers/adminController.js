const User = require("../models/user");
const Skill = require("../models/Skill");
const LearningPath = require("../models/learningPath");
const Goal = require("../models/goal");
const Certification = require("../models/certification");

// GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get all users error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};


// GET ADMIN STATISTICS
const getAdminStats = async (req, res) => {
    try {

        const [
            totalUsers,
            totalStudents,
            totalAdmins,
            totalSkills,
            totalLearningPaths,
            totalGoals,
            totalCertifications
        ] = await Promise.all([

            User.countDocuments(),

            User.countDocuments({
                role: "student"
            }),

            User.countDocuments({
                role: "admin"
            }),

            Skill.countDocuments(),

            LearningPath.countDocuments(),

            Goal.countDocuments(),

            Certification.countDocuments()
        ]);


        res.status(200).json({
            success: true,

            statistics: {
                totalUsers,
                totalStudents,
                totalAdmins,
                totalSkills,
                totalLearningPaths,
                totalGoals,
                totalCertifications
            }
        });

    } catch (error) {

        console.error("Get admin statistics error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch admin statistics",
            error: error.message
        });
    }
};


module.exports = {
    getAllUsers,
    getAdminStats
};