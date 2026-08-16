const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");

// ======================================
// Create Teacher
// POST /teacher
// ======================================
const createTeacher = async (req, res) => {
    try {
        const teacher = new Teacher(req.body);

        await teacher.save();

        res.status(201).json({
            message: "Teacher created successfully",
            teacher,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// ======================================
// Teacher Login
// POST /teacher/login
// ======================================
const teacherLogin = async (req, res) => {
    try {
        const { employeeId, password } = req.body;

        const teacher = await Teacher.findOne({ employeeId });

        if (!teacher) {
            return res.status(401).json({
                message: "Invalid Employee ID or Password",
            });
        }

        if (teacher.password !== password) {
            return res.status(401).json({
                message: "Invalid Employee ID or Password",
            });
        }

        const token = jwt.sign(
            {
                id: teacher._id,
                employeeId: teacher.employeeId,
                role: "Teacher",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        res.status(200).json({
            message: "Teacher Login Successful",
            token,
            teacher,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// ======================================
// Students Needing Guidance
// GET /teacher/students-needing-guidance
// ======================================
const getStudentsNeedingGuidance = async (req, res) => {
    try {
        const students = await Student.find({
            placementStatus: {
                $in: [
                    "Needs Guidance",
                    "Immediate Attention",
                ],
            },
        });

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// ======================================
// Export
// ======================================
module.exports = {
    createTeacher,
    teacherLogin,
    getStudentsNeedingGuidance,
};