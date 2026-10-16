const teacherOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required. Please log in.",
        });
    }

    if (req.user.role !== "Teacher") {
        return res.status(403).json({
            message: "Access denied. Teacher access required.",
        });
    }

    next();
};

module.exports = teacherOnly;