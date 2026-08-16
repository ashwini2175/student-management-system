const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const teacherOnly = require("../middleware/teacherMiddleware");

const router = express.Router();

const {
    createTrainingMaterial,
    getAllTrainingMaterials,
    getTrainingByYear,
    deleteTrainingMaterial,
    getMyTrainingMaterials,
} = require("../controllers/trainingController");

// Teacher
router.post(
    "/",
    verifyToken,
    teacherOnly,
    createTrainingMaterial
);

router.delete(
    "/:id",
    verifyToken,
    teacherOnly,
    deleteTrainingMaterial
);

// General training data
router.get("/", getAllTrainingMaterials);

router.get(
    "/year/:year",
    getTrainingByYear
);

// Student
router.get(
    "/my",
    verifyToken,
    getMyTrainingMaterials
);

module.exports = router;