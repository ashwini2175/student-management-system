const TrainingMaterial = require("../models/TrainingMaterial");

const Student = require("../models/Student");
// ======================================
// Create Training Material
// POST /training
// ======================================
const createTrainingMaterial = async (req, res) => {
    try {

        const trainingMaterial = new TrainingMaterial(req.body);

        await trainingMaterial.save();

        res.status(201).json({
            message: "Training Material Added Successfully",
            trainingMaterial
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// ======================================
// Get All Training Materials
// GET /training
// ======================================
const getAllTrainingMaterials = async (req, res) => {
    try {

        const materials = await TrainingMaterial.find()
            .sort({ createdAt: -1 });

        res.status(200).json(materials);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// ======================================
// Get Training Materials By Year
// GET /training/year/:year
// ======================================
const getTrainingByYear = async (req, res) => {
    try {

        const year = Number(req.params.year);

        const materials = await TrainingMaterial.find({
            year: year
        }).sort({ createdAt: -1 });

        res.status(200).json(materials);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// ======================================
// Delete Training Material
// DELETE /training/:id
// ======================================
const deleteTrainingMaterial = async (req, res) => {
    try {

        const material = await TrainingMaterial.findByIdAndDelete(
            req.params.id
        );

        if (!material) {
            return res.status(404).json({
                message: "Training Material Not Found"
            });
        }

        res.status(200).json({
            message: "Training Material Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const getMyTrainingMaterials = async (req, res) => {
    try {

        // req.student comes from JWT middleware
        const student = await Student.findById(req.student.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const materials = await TrainingMaterial.find({
            year: student.year
        }).sort({ createdAt: -1 });

        res.status(200).json({
            year: student.year,
            materials
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


module.exports = {
    createTrainingMaterial,
    getAllTrainingMaterials,
    getTrainingByYear,
    deleteTrainingMaterial,
    getMyTrainingMaterials
};