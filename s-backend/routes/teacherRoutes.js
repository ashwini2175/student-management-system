const express = require("express");

const router = express.Router();

const {
    createTeacher,
    teacherLogin,
    getStudentsNeedingGuidance,
} = require("../controllers/teacherController");

router.post("/login", teacherLogin);

router.post("/", createTeacher);

router.get(
    "/students-needing-guidance",
    getStudentsNeedingGuidance
);

router.get(
    "/guidance",
    getStudentsNeedingGuidance
);

module.exports = router;