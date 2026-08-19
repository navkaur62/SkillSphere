const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const protect = require("../middleware/authmiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected test route
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "You can access this protected route",
    user: req.user,
  });
});

module.exports = router;