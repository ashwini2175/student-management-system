const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
    },

    department: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      default: 0,
    },

    subjects: [
      {
        type: String,
      },
    ],

    role: {
      type: String,
      default: "Teacher",
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

teacherSchema.add({ tokenVersion: { type: Number, default: 0 } });
teacherSchema.set("optimisticConcurrency", true);
teacherSchema.set("toJSON", {
  transform: (_doc, result) => {
    delete result.password;
    delete result.resetHash;
    delete result.resetExpires;
    return result;
  },
});
teacherSchema.add({
  resetHash: { type: String, select: false },
  resetExpires: { type: Date, select: false },
});
module.exports = mongoose.model("Teacher", teacherSchema);
