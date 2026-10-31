const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
module.exports = async (req, res, next) => {
  const parts = req.headers.authorization?.trim().split(/\s+/);
  if (!parts || parts.length !== 2 || parts[0].toLowerCase() !== "bearer")
    return res.status(401).json({ message: "Please log in." });
  let user;
  try {
    user = jwt.verify(parts[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    return res
      .status(401)
      .json({ message: "Session expired. Please log in again." });
  }
  if (
    !["Student", "Teacher"].includes(user.role) ||
    !/^[a-f0-9]{24}$/i.test(user.id || "")
  )
    return res.status(401).json({ message: "Invalid session." });
  try {
    const account = await (user.role === "Student" ? Student : Teacher)
      .findById(user.id)
      .select("-password");
    if (!account)
      return res.status(401).json({ message: "Account no longer exists." });
    if ((user.version || 0) !== (account.tokenVersion || 0))
      return res.status(401).json({ message: "Please log in again." });
    req.user = { ...user, prn: account.prn };
    req.account = account;
    if (user.role === "Student") req.student = req.user;
    else req.teacher = req.user;
    next();
  } catch (error) {
    next(error);
  }
};
