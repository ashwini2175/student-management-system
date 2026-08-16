const cors = require("cors");

require("dotenv").config();
const trainingRoutes = require("./routes/trainingRoutes");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const guidanceRoutes = require("./routes/guidanceRoutes");
const notificationRoutes = require("./routes/notificationRoutes");



const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/notification", notificationRoutes);
app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/auth", authRoutes);
app.use("/guidance", guidanceRoutes);
app.use("/training", trainingRoutes);
app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on Port ${process.env.PORT}`);
});