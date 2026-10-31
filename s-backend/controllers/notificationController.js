const Notification = require("../models/Notification");
const { wrap, fail } = require("../utils/http");
const { publish } = require("../utils/events");
exports.getNotificationsByPRN = wrap(async (req, res) =>
  res.json(
    await Notification.find({ studentPRN: req.params.prn }).sort({
      createdAt: -1,
    }),
  ),
);
exports.markAsRead = wrap(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, studentPRN: req.user.prn },
    { $set: { isRead: true } },
    { new: true },
  );
  if (!notification) throw fail(404, "Notification not found.");
  publish("notifications", req.user.prn);
  res.json({ notification });
});
