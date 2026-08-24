const express = require("express");

const router = express.Router();

const {
    createCertification,
    getCertifications,
    updateCertification,
    deleteCertification
} = require("../controllers/certificationController");

const authMiddleware = require("../middleware/authmiddleware");

// Create certification
router.post("/", authMiddleware, createCertification);

// Get logged-in user's certifications
router.get("/", authMiddleware, getCertifications);
// Update certification
router.put("/:id", authMiddleware, updateCertification);

// Delete certification
router.delete("/:id", authMiddleware, deleteCertification);

module.exports = router;