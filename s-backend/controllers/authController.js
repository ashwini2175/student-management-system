const Student = require("../models/Student");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const studentLogin = async (req, res) => {
    try {
        const { prn, password } = req.body;
        if (typeof prn !== "string" || typeof password !== "string") {
            return res.status(400).json({
                message: "PRN and password are required"
            });
        }

        const student = await Student.findOne({ prn });
        if (!student || !student.password) {
            return res.status(401).json({
                message: "Invalid PRN or Password"
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            student.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid PRN or Password"
            });
        }

        const token = jwt.sign(
            {
                id: student._id,
                prn: student.prn,
                role: "Student"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Student Login Successful",
            token,
            student
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    studentLogin
};