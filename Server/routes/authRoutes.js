const express = require("express");
const User = require("../models/user");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const protect = require("../middleware/authmiddleware");

const router = express.Router();

// ===============================
// REGISTER
// ===============================
router.post("/register", registerUser);


// ===============================
// LOGIN
// ===============================
router.post("/login", loginUser);


// ===============================
// GET LOGGED-IN USER PROFILE
// ===============================
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("skills.skill");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });

  } catch (error) {
    console.error("Profile error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


module.exports = router;