const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Skill name is required"],
            unique: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        category: {
            type: String,
            required: [true, "Skill category is required"],
            trim: true
        },

        description: {
            type: String,
            maxlength: 300,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Skill", skillSchema);