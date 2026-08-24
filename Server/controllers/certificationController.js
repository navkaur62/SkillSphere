const Certification = require("../models/certification");

// CREATE CERTIFICATION
const createCertification = async (req, res) => {
    try {
        const {
            title,
            issuer,
            issueDate,
            expiryDate,
            credentialId,
            credentialUrl,
            description
        } = req.body;

        if (!title || !issuer || !issueDate) {
            return res.status(400).json({
                success: false,
                message: "Title, issuer and issue date are required"
            });
        }
        // Validate issue date
const parsedIssueDate = new Date(issueDate);

if (isNaN(parsedIssueDate.getTime())) {
    return res.status(400).json({
        success: false,
        message: "Invalid issue date"
    });
}

// Validate expiry date if provided
if (expiryDate) {
    const parsedExpiryDate = new Date(expiryDate);

    if (isNaN(parsedExpiryDate.getTime())) {
        return res.status(400).json({
            success: false,
            message: "Invalid expiry date"
        });
    }

    if (parsedExpiryDate < parsedIssueDate) {
        return res.status(400).json({
            success: false,
            message: "Expiry date cannot be before issue date"
        });
    }
}

        const certification = await Certification.create({
            title,
            issuer,
            issueDate,
            expiryDate,
            credentialId,
            credentialUrl,
            description,
            user: req.user.userId
        });

        res.status(201).json({
            success: true,
            message: "Certification created successfully",
            certification
        });
    } catch (error) {
        console.error("Create certification error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create certification",
            error: error.message
        });
    }
};


// GET ALL CERTIFICATIONS
const getCertifications = async (req, res) => {
    try {
        const certifications = await Certification.find({
            user: req.user.userId
        }).sort({ issueDate: -1 });

        res.status(200).json({
            success: true,
            count: certifications.length,
            certifications
        });
    } catch (error) {
        console.error("Get certifications error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch certifications",
            error: error.message
        });
    }
};


// UPDATE CERTIFICATION
const updateCertification = async (req, res) => {
    try {
        const certification = await Certification.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!certification) {
            return res.status(404).json({
                success: false,
                message: "Certification not found"
            });
        }

        const {
            title,
            issuer,
            issueDate,
            expiryDate,
            credentialId,
            credentialUrl,
            description
        } = req.body;

        certification.title = title ?? certification.title;
        certification.issuer = issuer ?? certification.issuer;
        certification.issueDate = issueDate ?? certification.issueDate;
        certification.expiryDate = expiryDate ?? certification.expiryDate;
        certification.credentialId = credentialId ?? certification.credentialId;
        certification.credentialUrl = credentialUrl ?? certification.credentialUrl;
        certification.description = description ?? certification.description;

        await certification.save();

        res.status(200).json({
            success: true,
            message: "Certification updated successfully",
            certification
        });
    } catch (error) {
        console.error("Update certification error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update certification",
            error: error.message
        });
    }
};
// DELETE CERTIFICATION
const deleteCertification = async (req, res) => {
    try {
        const certification = await Certification.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!certification) {
            return res.status(404).json({
                success: false,
                message: "Certification not found"
            });
        }

        await certification.deleteOne();

        res.status(200).json({
            success: true,
            message: "Certification deleted successfully"
        });
    } catch (error) {
        console.error("Delete certification error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete certification",
            error: error.message
        });
    }
};

// EXPORT CONTROLLERS
module.exports = {
    createCertification,
    getCertifications,
    updateCertification,
    deleteCertification
};