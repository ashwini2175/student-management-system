const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    sourceKey: { type: String },

    studentPRN: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index(
  { sourceKey: 1, studentPRN: 1 },
  { unique: true, partialFilterExpression: { sourceKey: { $type: "string" } } },
);
module.exports = mongoose.model("Notification", notificationSchema);
