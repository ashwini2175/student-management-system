const Student = require("../models/Student");
const jwt = require("jsonwebtoken");

const studentLogin = async (req, res) => {
    try {
        const { prn, password } = req.body;

        const student = await Student.findOne({ prn });

        if (!student) {
            return res.status(401).json({
                message: "Invalid PRN or Password"
            });
        }

        if (student.password !== password) {
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