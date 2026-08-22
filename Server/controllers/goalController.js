const Goal = require("../models/goal");
const User = require("../models/user");

// CREATE GOAL
const createGoal = async (req, res) => {
    try {
        const {
            title,
            description,
            targetDate
        } = req.body;

        if (!title || !targetDate) {
            return res.status(400).json({
                success: false,
                message: "Title and target date are required"
            });
        }

        const goal = await Goal.create({
            title,
            description,
            targetDate,
            createdBy: req.user.userId
        });

        // Add goal to user's profile
        await User.findByIdAndUpdate(
            req.user.userId,
            {
                $push: { goals: goal._id }
            }
        );

        res.status(201).json({
            success: true,
            message: "Goal created successfully",
            goal
        });

    } catch (error) {
        console.error("Create goal error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while creating goal"
        });
    }
};


// GET MY GOALS
const getMyGoals = async (req, res) => {
    try {
        const goals = await Goal.find({
            createdBy: req.user.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: goals.length,
            goals
        });

    } catch (error) {
        console.error("Get goals error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching goals"
        });
    }
};


// GET SINGLE GOAL
const getGoalById = async (req, res) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            createdBy: req.user.userId
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Goal not found"
            });
        }

        res.status(200).json({
            success: true,
            goal
        });

    } catch (error) {
        console.error("Get goal error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching goal"
        });
    }
};


// UPDATE GOAL
const updateGoal = async (req, res) => {
    try {
        const {
            title,
            description,
            targetDate,
            progress,
            status
        } = req.body;

        const goal = await Goal.findOne({
            _id: req.params.id,
            createdBy: req.user.userId
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Goal not found"
            });
        }

        if (title !== undefined) {
            goal.title = title;
        }

        if (description !== undefined) {
            goal.description = description;
        }

        if (targetDate !== undefined) {
            goal.targetDate = targetDate;
        }

        if (progress !== undefined) {
            goal.progress = progress;
        }

        if (status !== undefined) {
            goal.status = status;
        }

        await goal.save();

        res.status(200).json({
            success: true,
            message: "Goal updated successfully",
            goal
        });

    } catch (error) {
        console.error("Update goal error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while updating goal"
        });
    }
};


// DELETE GOAL
const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            createdBy: req.user.userId
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Goal not found"
            });
        }

        await Goal.findByIdAndDelete(req.params.id);

        // Remove goal from user's profile
        await User.findByIdAndUpdate(
            req.user.userId,
            {
                $pull: { goals: goal._id }
            }
        );

        res.status(200).json({
            success: true,
            message: "Goal deleted successfully"
        });

    } catch (error) {
        console.error("Delete goal error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while deleting goal"
        });
    }
};


module.exports = {
    createGoal,
    getMyGoals,
    getGoalById,
    updateGoal,
    deleteGoal
};