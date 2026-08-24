const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Certification title is required"],
            trim: true,
            maxlength: 100
        },

        issuer: {
            type: String,
            required: [true, "Issuing organization is required"],
            trim: true,
            maxlength: 100
        },

        issueDate: {
            type: Date,
            required: [true, "Issue date is required"]
        },

        expiryDate: {
            type: Date,
            default: null
        },

        credentialId: {
            type: String,
            trim: true,
            default: ""
        },

        credentialUrl: {
            type: String,
            trim: true,
            default: ""
        },

        description: {
            type: String,
            maxlength: 500,
            default: ""
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Certification", certificationSchema);