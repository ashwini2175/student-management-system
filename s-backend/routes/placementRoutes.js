const express = require("express");

const router = express.Router();

const {
    createPlacement,
    getAllPlacements,
} = require("../controllers/placementController");

// Teacher creates placement drive
router.post("/", createPlacement);

// Get all placement drives
router.get("/", getAllPlacements);

module.exports = router;