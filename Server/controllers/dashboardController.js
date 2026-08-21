const User = require("../models/user");

// Get dashboard data for logged-in user
const getDashboard = async (req, res) => {
    try {
        // Get user from database
        const user = await User.findById(req.user.userId)
    .populate("skills.skill", "name category");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const skills = user.skills || [];

        // Calculate skill statistics
        const totalSkills = skills.length;

        const completedSkills = skills.filter(
            (skill) => skill.status === "Completed"
        ).length;

        const learningSkills = skills.filter(
            (skill) => skill.status === "Learning"
        ).length;

        const notStartedSkills = skills.filter(
            (skill) => skill.status === "Not Started"
        ).length;

        // Calculate overall progress
        const overallProgress =
            totalSkills > 0
                ? Math.round(
                      skills.reduce(
                          (total, skill) => total + skill.progress,
                          0
                      ) / totalSkills
                  )
                : 0;

        // Get recent skills
        const recentSkills = [...skills]
            .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
            .slice(0, 5);

        res.status(200).json({
            success: true,

            user: {
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                level: user.level,
                totalPoints: user.totalPoints
            },

            statistics: {
                totalSkills,
                completedSkills,
                learningSkills,
                notStartedSkills
            },

            overallProgress,

            recentSkills
        });
    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
};

module.exports = {
    getDashboard
};