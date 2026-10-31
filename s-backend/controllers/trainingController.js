const Training = require("../models/TrainingMaterial");
const { wrap, text, number, url, fail } = require("../utils/http");
const { publish } = require("../utils/events");
exports.createTrainingMaterial = wrap(async (req, res) => {
  const b = req.body;
  const year = number(b.year, "Year", 1, 4);
  if (!Number.isInteger(year)) throw fail(400, "Year must be an integer.");
  if (!["PDF", "Video", "Link", "Practice"].includes(b.type))
    throw fail(400, "Invalid material type.");
  const trainingMaterial = await Training.create({
    title: text(b.title, "Title"),
    description:
      typeof b.description === "string" ? b.description.slice(0, 5000) : "",
    year,
    category: text(b.category, "Category"),
    type: b.type,
    link: url(b.link),
    uploadedBy: req.account.name,
  });
  publish("training");
  res.status(201).json({ trainingMaterial });
});
exports.getAllTrainingMaterials = wrap(async (req, res) =>
  res.json(
    await Training.find(
      req.user.role === "Student" ? { year: req.account.year } : {},
    ).sort({ createdAt: -1 }),
  ),
);
exports.getMyTrainingMaterials = wrap(async (req, res) =>
  res.json({
    year: req.account.year,
    materials: await Training.find({ year: req.account.year }).sort({
      createdAt: -1,
    }),
  }),
);
exports.deleteTrainingMaterial = wrap(async (req, res) => {
  if (!(await Training.findByIdAndDelete(req.params.id)))
    throw fail(404, "Material not found.");
  publish("training");
  res.json({ message: "Material deleted." });
});
