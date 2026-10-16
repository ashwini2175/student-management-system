const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
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
            enum: [
                "Placement Ready",
                "Needs Guidance",
                "Immediate Attention",
            ],
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
    }
);

module.exports = mongoose.model("Student", studentSchema);