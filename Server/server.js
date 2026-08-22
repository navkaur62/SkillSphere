const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const skillRoutes = require("./routes/skillRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const learningPathRoutes = require("./routes/learningPathRoutes");
const goalRoutes = require("./routes/goalRoutes");
dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/skills", skillRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/learning-paths", learningPathRoutes);
app.use("/api/goals", goalRoutes);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SkillSphere server running on port ${PORT}`);
});