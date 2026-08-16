const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    console.log("AUTH HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access Denied. No Token Provided.",
        });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN EXISTS:", !!token);

    if (!token) {
        return res.status(401).json({
            message: "Access Denied. Invalid Token Format.",
        });
    }

    try {
        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("VERIFIED JWT:", verified);

        req.user = verified;

        if (verified.role === "Student") {
            req.student = verified;
        }

        if (verified.role === "Teacher") {
            req.teacher = verified;
        }

        console.log("REQ.USER:", req.user);
        console.log("REQ.TEACHER:", req.teacher);

        next();

    } catch (error) {
        console.log("JWT ERROR:", error.message);

        return res.status(401).json({
            message: "Invalid or Expired Token",
        });
    }
};

module.exports = verifyToken;