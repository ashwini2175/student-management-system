const Student = require("../models/Student");
const calculatePlacementScore = require("../utils/calculatePlacementScore");

const createStudent = async (req, res) => {

    try {

        const student = new Student(req.body);

        // Calculate Placement Score
        student.placementScore = calculatePlacementScore(student);

        // Decide Placement Status
        if (student.placementScore >= 80) {
            student.placementStatus = "Placement Ready";
        } else if (student.placementScore >= 50) {
            student.placementStatus = "Needs Guidance";
        } else {
            student.placementStatus = "Immediate Attention";
        }

        await student.save();

        res.status(201).json({
            message: "Student Saved Successfully",
            student
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const getAllStudents = async (req, res) => {
    try {

        const students = await Student.find();

        res.status(200).json(students);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const getStudentByPrn = async (req, res) => {

    try {

        const student = await Student.findOne({
            prn: req.params.prn
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(student);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
const filterStudents = async (req, res) => {
    try {

        const filter = {};

        // Filter by CGPA
        if (req.query.cgpa) {
            filter.cgpa = { $gte: Number(req.query.cgpa) };
        }

        // Filter by Placement Status
        if (req.query.placementStatus) {
            filter.placementStatus = req.query.placementStatus;
        }

        // Filter by Department
        if (req.query.department) {
            filter.department = req.query.department;
        }

        const students = await Student.find(filter);

        res.status(200).json(students);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
const getStudentProfile = async (req, res) => {

    try {

        const student = await Student.findById(req.student.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(student);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
module.exports = {
    createStudent,
    getAllStudents,
    getStudentByPrn,
    filterStudents,
    getStudentProfile
};