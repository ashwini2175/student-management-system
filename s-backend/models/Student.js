const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    emailVerified: { type: Boolean, default: false },
    phone: { type: String, default: "" },
    phoneVerified: { type: Boolean, default: false },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    prn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },

    cgpa: {
      type: Number,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    resumeUploaded: {
      type: Boolean,
      default: false,
    },

    projectCount: {
      type: Number,
      default: 0,
    },

    internshipCount: {
      type: Number,
      default: 0,
    },

    aptitudeScore: {
      type: Number,
      default: 0,
    },

    communicationScore: {
      type: Number,
      default: 0,
    },

    interestDomain: {
      type: String,
      default: "",
      trim: true,
    },

    placementScore: {
      type: Number,
      default: 0,
    },

    placementStatus: {
      type: String,
      enum: ["Placement Ready", "Needs Guidance", "Immediate Attention"],
      default: "Needs Guidance",
    },

    password: {
      type: String,
      required: true,
    },

    // =========================
    // PROJECTS
    // =========================

    projects: [
      {
        title: {
          type: String,
          required: true,
        },

        description: {
          type: String,
          default: "",
        },

        githubLink: {
          type: String,
          trim: true,
          default: "",
        },

        technologies: {
          type: [String],
          default: [],
        },

        status: {
          type: String,
          default: "Ongoing",
        },

        features: {
          type: [String],
          default: [],
        },

        challenges: {
          type: [String],
          default: [],
        },

        futureScope: {
          type: [String],
          default: [],
        },
      },
    ],

    // =========================
    // CERTIFICATES
    // =========================

    certificates: [
      {
        title: {
          type: String,
          required: true,
        },

        issuer: {
          type: String,
          required: true,
        },

        year: {
          type: Number,
        },

        credentialUrl: {
          type: String,
          default: "",
        },

        fileName: {
          type: String,
          default: "",
        },

        fileUrl: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

studentSchema.add({ resumeUrl: { type: String, default: "" } });
studentSchema.pre("validate", function () {
  this.projectCount = this.projects.length;
  this.placementScore = require("../utils/calculatePlacementScore")(this);
  this.placementStatus =
    this.placementScore >= 80
      ? "Placement Ready"
      : this.placementScore >= 50
        ? "Needs Guidance"
        : "Immediate Attention";
});
studentSchema.add({ tokenVersion: { type: Number, default: 0 } });
studentSchema.set("optimisticConcurrency", true);
studentSchema.set("toJSON", {
  transform: (_doc, result) => {
    delete result.password;
    delete result.resetHash;
    delete result.resetExpires;
    return result;
  },
});
studentSchema.add({
  resetHash: { type: String, select: false },
  resetExpires: { type: Date, select: false },
});
module.exports = mongoose.model("Student", studentSchema);
