const express = require("express");

const router = express.Router(); const authMiddleware = require("../middleware/authMiddleware");
const uploadProfile = require("../middleware/uploadProfile");
const uploadCertificate = require("../middleware/uploadCertificate");
const verifyToken = require("../middleware/authMiddleware");


const {
    createStudent,
    getAllStudents,
    getStudentByPrn,
    filterStudents,
    getStudentProfile,
    updateStudentProfile,
    getStudentProjects,
    addProject,
    updateProject,
    deleteProject,

    getStudentCertificates,
    addStudentCertificate,
    updateStudentProfilePhoto
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

router.put(
    "/profile/photo",
    authMiddleware,
    uploadProfile.single("profilePhoto"),
    updateStudentProfilePhoto
);
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
router.put(
    "/profile",
    verifyToken,
    updateStudentProfile
);

// ===============================
// Student Projects
// IMPORTANT: These must come
// BEFORE /:prn
// ===============================

router.get("/projects", verifyToken, getStudentProjects);

router.post("/projects", verifyToken, addProject);

router.put("/projects/:id", verifyToken, updateProject);

router.delete("/projects/:id", verifyToken, deleteProject);
// ===============================
// Student Certificates
// ===============================

// GET /student/certificates
router.get(
    "/certificates",
    verifyToken,
    getStudentCertificates
);

router.post(
    "/certificates",
    verifyToken,
    uploadCertificate.single("certificate"),
    addStudentCertificate
);


// ===============================
// Get Student By PRN
// IMPORTANT: Keep this LAST
// ===============================

router.get("/:prn", getStudentByPrn);


module.exports = router;