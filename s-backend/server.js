const cors = require("cors");

require("dotenv").config();

const express = require("express");
const path = require("path");

const trainingRoutes = require("./routes/trainingRoutes");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const guidanceRoutes = require("./routes/guidanceRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const placementRoutes = require("./routes/placementRoutes");
const app = express();
// Serve uploaded files
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

connectDB();

app.use(cors());

app.use(express.json());


// =====================================
// Uploaded Files
// =====================================

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);


// =====================================
// Routes
// =====================================

app.use("/notification", notificationRoutes);

app.use("/student", studentRoutes);

app.use("/teacher", teacherRoutes);

app.use("/dashboard", dashboardRoutes);

app.use("/auth", authRoutes);

app.use("/guidance", guidanceRoutes);

app.use("/training", trainingRoutes);

app.use("/placement", placementRoutes);
// =====================================
// Server
// =====================================

app.listen(process.env.PORT, () => {
    console.log(
        `🚀 Server running on Port ${process.env.PORT}`
    );
});