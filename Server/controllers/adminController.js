const User = require("../models/user");

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
        const totalUsers = await User.countDocuments();

        const totalStudents = await User.countDocuments({
            role: "student"
        });

        const totalAdmins = await User.countDocuments({
            role: "admin"
        });

        res.status(200).json({
            success: true,
            statistics: {
                totalUsers,
                totalStudents,
                totalAdmins
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