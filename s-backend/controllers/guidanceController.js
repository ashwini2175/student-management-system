const Guidance = require("../models/Guidance");
const Student = require("../models/Student");
const { wrap, text, fail } = require("../utils/http");
const { publish } = require("../utils/events");
exports.addGuidance = wrap(async (req, res) => {
  const b = req.body;
  const studentPRN = text(b.studentPRN, "PRN", 40);
  if (!(await Student.exists({ prn: studentPRN })))
    throw fail(404, "Student PRN not found.");
  if (!["Career", "Academic", "Placement", "Project"].includes(b.category))
    throw fail(400, "Invalid category.");
  const guidance = await Guidance.create({
    studentPRN,
    title: text(b.title, "Title"),
    message: text(b.message, "Message", 5000),
    category: b.category,
  });
  publish("guidance", studentPRN);
  res.status(201).json({ guidance });
});
exports.getAllGuidance = wrap(async (req, res) =>
  res.json(await Guidance.find().sort({ createdAt: -1 })),
);
exports.getStudentGuidance = wrap(async (req, res) =>
  res.json(
    await Guidance.find({ studentPRN: req.params.prn }).sort({ createdAt: -1 }),
  ),
);
