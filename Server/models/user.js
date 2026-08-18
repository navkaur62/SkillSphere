const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student"
        },

        profileImage: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            maxlength: 500,
            default: ""
        },

        skills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ],

        learningPaths: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "LearningPath"
            }
        ],

        goals: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Goal"
            }
        ],

        totalPoints: {
            type: Number,
            default: 0
        },

        level: {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);