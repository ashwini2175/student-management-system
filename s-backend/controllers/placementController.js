const Placement = require("../models/Placement");
const Student = require("../models/Student");
const Notification = require("../models/Notification");
const { wrap, text, number, fail } = require("../utils/http");
const { publish } = require("../utils/events");
const input = (b) => {
  const driveDate = text(b.driveDate, "Date");
  const time = text(b.time, "Time");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(driveDate) ||
    Number.isNaN(Date.parse(driveDate)) ||
    new Date(driveDate).toISOString().slice(0, 10) !== driveDate
  )
    throw fail(400, "Enter a valid date.");
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
    throw fail(400, "Enter a valid time.");
  return {
    company: text(b.company, "Company"),
    role: text(b.role, "Role"),
    eligibilityCGPA: number(b.eligibilityCGPA, "CGPA", 0, 10),
    package: text(b.package, "Package"),
    driveDate,
    time,
    location: text(b.location, "Location"),
    description:
      typeof b.description === "string"
        ? b.description.trim().slice(0, 5000)
        : "",
  };
};
exports.notify = async (p) => {
  const students = await Student.find({
    cgpa: { $gte: p.eligibilityCGPA },
  }).select("prn");
  if (students.length)
    await Notification.bulkWrite(
      students.map((s) => ({
        updateOne: {
          filter: { sourceKey: `placement:${p._id}`, studentPRN: s.prn },
          update: {
            $setOnInsert: {
              title: `${p.company} placement drive`,
              message: `${p.role} | CGPA ${p.eligibilityCGPA}+ | ${p.package} | ${p.driveDate} ${p.time} | ${p.location}`,
              isRead: false,
            },
          },
          upsert: true,
        },
      })),
    );
  publish("placements");
  return students.length;
};
exports.createPlacement = wrap(async (req, res) => {
  const p = await Placement.create({
    ...input(req.body),
    createdBy: req.user.id,
  });
  let notificationsSent = 0,
    warning;
  try {
    notificationsSent = await exports.notify(p);
  } catch {
    warning =
      "Drive saved, but notifications failed. Use Retry notifications; do not recreate the drive.";
    publish("placements");
  }
  res.status(201).json({ placement: p, notificationsSent, warning });
});
exports.retryNotifications = wrap(async (req, res) => {
  const p = await Placement.findById(req.params.id);
  if (!p) throw fail(404, "Drive not found.");
  res.json({ notificationsSent: await exports.notify(p) });
});
exports.getAllPlacements = wrap(async (req, res) =>
  res.json(await Placement.find().sort({ driveDate: 1, time: 1 })),
);
exports.deletePlacement = wrap(async (req, res) => {
  const p = await Placement.findByIdAndDelete(req.params.id);
  if (!p) throw fail(404, "Drive not found.");
  await Notification.deleteMany({ sourceKey: `placement:${p._id}` });
  publish("placements");
  res.json({ message: "Drive deleted." });
});
