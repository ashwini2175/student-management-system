const express = require("express");

const router = express.Router();

const {
    addGuidance,
    getAllGuidance,
    getStudentGuidance
} = require("../controllers/guidanceController");

// Teacher adds guidance
router.post("/", addGuidance);

// Teacher views all guidance
router.get("/", getAllGuidance);

// Student views their guidance
router.get("/:prn", getStudentGuidance);

module.exports = router;