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

        department: {
            type: String,
            required: true,
            trim: true,
        },

        // 1 = FY, 2 = SY, 3 = TY, 4 = B.Tech / Final Year
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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Student", studentSchema);