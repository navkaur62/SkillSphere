const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const skillRoutes = require("./routes/skillRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const learningPathRoutes = require("./routes/learningPathRoutes");
const goalRoutes = require("./routes/goalRoutes");
const certificationRoutes = require("./routes/certificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
dotenv.config();

const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/skills", skillRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/learning-paths", learningPathRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorMiddleware);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SkillSphere server running on port ${PORT}`);
});