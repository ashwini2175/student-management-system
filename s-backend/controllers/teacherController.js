const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ======================================
// Create Teacher
// POST /teacher
// ======================================
const createTeacher = async (req, res) => {
    try {
        const { password } = req.body;

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const teacher = new Teacher({
            ...req.body,
            password: hashedPassword,
            role: "Teacher",
        });

        await teacher.save();

        const safeTeacher = teacher.toObject();
        delete safeTeacher.password;

        res.status(201).json({
            message: "Teacher created successfully",
            teacher: safeTeacher,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// ======================================
// Teacher Login
const teacherLogin = async (req, res) => {
    try {
        const { employeeId, department, password } = req.body;
        if (
            typeof employeeId !== "string" ||
            !employeeId.trim() ||
            typeof department !== "string" ||
            !department.trim() ||
            typeof password !== "string" ||
            !password
        ) {
            return res.status(400).json({
                message: "Employee ID, department and password are required",
            });
        }
        // Find teacher using unique Employee ID
        const teacher = await Teacher.findOne({
            employeeId: employeeId.trim(),
        });
        console.log("Teacher lookup:", {
            database: Teacher.db.name,
            collection: Teacher.collection.name,
            employeeId: JSON.stringify(employeeId.trim()),
            found: Boolean(teacher),
        });
        if (!teacher) {
            return res.status(401).json({
                message: "Invalid Employee ID",
            });
        }

        // Check department
        if (
            teacher.department.trim().toLowerCase() !==
            department.trim().toLowerCase()
        ) {
            return res.status(401).json({
                message: "Invalid Employee ID or Department",
            });
        }

        // Check password
        const passwordMatches =
            typeof teacher.password === "string" &&
            await bcrypt.compare(password, teacher.password);

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid Employee ID or Password",
            });
        }

        // Create JWT
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

        // Never send password to frontend
        res.status(200).json({
            message: "Teacher Login Successful",

            token,

            teacher: {
                id: teacher._id,
                name: teacher.name,
                employeeId: teacher.employeeId,
                email: teacher.email,
                department: teacher.department,
                designation: teacher.designation,
                experience: teacher.experience,
                subjects: teacher.subjects,
                role: teacher.role,
            },
        });

    } catch (error) {
        console.error("Teacher Login Error:", error);

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