const { fail } = require("../utils/http");
exports.teacher = (req, res, next) =>
  req.user.role === "Teacher"
    ? next()
    : next(fail(403, "Teacher access required."));
exports.student = (req, res, next) =>
  req.user.role === "Student"
    ? next()
    : next(fail(403, "Student access required."));
exports.owner = (req, res, next) =>
  req.user.role === "Teacher" || req.user.prn === req.params.prn
    ? next()
    : next(fail(403, "You can only access your own records."));
