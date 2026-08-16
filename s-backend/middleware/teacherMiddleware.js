const teacherOnly = (req, res, next) => {

    console.log("USER:", req.user);
    console.log("TEACHER:", req.teacher);

    if (!req.teacher) {
        return res.status(403).json({
            message: "Access denied. Teacher access required.",
        });
    }

    next();
};

module.exports = teacherOnly;