const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const { wrap, text, number, fail, safe } = require("../utils/http");
const { publish } = require("../utils/events");
const password = (value) => {
  if (
    typeof value !== "string" ||
    value.length < 8 ||
    Buffer.byteLength(value) > 72
  )
    throw fail(
      400,
      "Password must be at least 8 characters and at most 72 UTF-8 bytes.",
    );
  return value;
};
const email = (value) => {
  const s = text(value, "Email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))
    throw fail(400, "Enter a valid email.");
  return s;
};
const login = (role) =>
  wrap(async (req, res) => {
    const key = role === "Student" ? "prn" : "employeeId";
    const id = text(req.body[key], key);
    const entered = req.body.password;
    if (
      typeof entered !== "string" ||
      !entered ||
      Buffer.byteLength(entered) > 72
    )
      throw fail(401, "Invalid login details.");
    const account = await (role === "Student" ? Student : Teacher).findOne({
      [key]: id,
    });
    const matches =
      account?.password &&
      /^\$2[aby]\$/.test(account.password) &&
      (await bcrypt.compare(entered, account.password));
    const departmentOK =
      role === "Student" ||
      (typeof req.body.department === "string" &&
        account?.department?.trim().toLowerCase() ===
          req.body.department.trim().toLowerCase());
    if (!matches || !departmentOK) throw fail(401, "Invalid login details.");
    const token = jwt.sign(
      {
        id: String(account._id),
        role,
        [key]: id,
        version: account.tokenVersion || 0,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d", algorithm: "HS256" },
    );
    res.json({ token, role, [role.toLowerCase()]: safe(account) });
  });
exports.studentLogin = login("Student");
exports.teacherLogin = login("Teacher");
exports.register = wrap(async (req, res) => {
  const b = req.body;
  const year = number(b.year, "Year", 1, 4);
  if (!Number.isInteger(year)) throw fail(400, "Year must be an integer.");
  const student = await Student.create({
    name: text(b.name, "Name"),
    prn: text(b.prn, "PRN", 40),
    email: email(b.email),
    department: text(b.department, "Department"),
    year,
    cgpa: number(b.cgpa, "CGPA", 0, 10),
    password: await bcrypt.hash(password(b.password), 12),
  });
  publish("students");
  res
    .status(201)
    .json({
      message: "Account created. Please log in.",
      student: safe(student),
    });
});
exports.changePassword = wrap(async (req, res) => {
  const Model = req.user.role === "Student" ? Student : Teacher;
  const account = await Model.findById(req.user.id);
  if (
    typeof req.body.currentPassword !== "string" ||
    !(await bcrypt.compare(req.body.currentPassword, account.password))
  )
    throw fail(400, "Current password is incorrect.");
  account.resetHash = undefined;
  account.resetExpires = undefined;
  account.password = await bcrypt.hash(password(req.body.newPassword), 12);
  account.tokenVersion = (account.tokenVersion || 0) + 1;
  await account.save();
  require("../utils/events").disconnect(req.user.id);
  res.json({ message: "Password updated." });
});
exports.password = password;
exports.email = email;
