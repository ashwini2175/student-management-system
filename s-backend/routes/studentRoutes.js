const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createStudent,
    getAllStudents,
    getStudentByPrn,
    filterStudents,
    getStudentProfile
} = require("../controllers/studentController");

const {
    studentLogin
} = require("../controllers/authController");

// ===============================
// Student Login
// POST /student/login
// ===============================
router.post("/login", studentLogin);

// ===============================
// Create Student
// POST /student
// ===============================
router.post("/", createStudent);

// ===============================
// Get All Students
// GET /student
// ===============================
router.get("/", getAllStudents);

// ===============================
// Filter Students
// GET /student/filter/search
// ===============================
router.get("/filter/search", filterStudents);

// ===============================
// Logged-in Student Profile
// GET /student/profile
// ===============================
router.get("/profile", verifyToken, getStudentProfile);

// ===============================
// Get Student By PRN
// GET /student/:prn
// Keep this LAST
// ===============================
router.get("/:prn", getStudentByPrn);

module.exports = router;