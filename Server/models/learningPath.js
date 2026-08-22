const mongoose = require("mongoose");

const learningPathSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Learning path title is required"],
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        description: {
            type: String,
            required: [true, "Learning path description is required"],
            trim: true,
            maxlength: 500
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true
        },

        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner"
        },

        skills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ],

        duration: {
            type: Number,
            min: 1,
            required: [true, "Duration is required"]
        },

        enrolledUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("LearningPath", learningPathSchema);