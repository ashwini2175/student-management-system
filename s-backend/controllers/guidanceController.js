const Guidance = require("../models/Guidance");

// ===============================
// Add Guidance
// ===============================
const addGuidance = async (req, res) => {
    try {

        const guidance = new Guidance(req.body);

        await guidance.save();

        res.status(201).json({
            message: "Guidance Added Successfully",
            guidance
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// ===============================
// Get All Guidance
// ===============================
const getAllGuidance = async (req, res) => {
    try {

        const guidance = await Guidance.find();

        res.status(200).json(guidance);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// ===============================
// Get Guidance By Student PRN
// ===============================
const getStudentGuidance = async (req, res) => {
    try {

        const guidance = await Guidance.find({
            studentPRN: req.params.prn
        });

        res.status(200).json(guidance);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    addGuidance,
    getAllGuidance,
    getStudentGuidance
};