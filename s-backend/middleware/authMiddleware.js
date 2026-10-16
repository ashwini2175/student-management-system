const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Expected format: Bearer <token>
    const parts = authHeader?.trim().split(/\s+/);

    if (
        !parts ||
        parts.length !== 2 ||
        parts[0].toLowerCase() !== "bearer"
    ) {
        return res.status(401).json({
            message: "A valid Bearer token is required.",
        });
    }

    let verified;

    try {
        verified = jwt.verify(
            parts[1],
            process.env.JWT_SECRET
        );
    } catch {
        return res.status(401).json({
            message: "Invalid or Expired Token",
        });
    }

    req.user = verified;

    if (verified.role === "Student") {
        req.student = verified;
    }

    if (verified.role === "Teacher") {
        req.teacher = verified;
    }

    next();
};

module.exports = verifyToken;