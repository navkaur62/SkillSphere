const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Goal title is required"],
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        },

        targetDate: {
            type: Date,
            required: [true, "Target date is required"]
        },

        progress: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        status: {
            type: String,
            enum: ["Not Started", "In Progress", "Completed"],
            default: "Not Started"
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Goal", goalSchema);