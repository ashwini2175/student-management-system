const express = require("express");

const router = express.Router();

const {
    teacherLogin,
    getStudentsNeedingGuidance,
} = require("../controllers/teacherController");

const verifyToken = require("../middleware/authMiddleware");
const teacherOnly = require("../middleware/teacherMiddleware");

// Public: teacher login
router.post("/login", teacherLogin);

// Protected: only teachers can access these routes
router.get(
    "/students-needing-guidance",
    verifyToken,
    teacherOnly,
    getStudentsNeedingGuidance
);

router.get(
    "/guidance",
    verifyToken,
    teacherOnly,
    getStudentsNeedingGuidance
);

module.exports = router;