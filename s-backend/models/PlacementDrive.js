const mongoose = require("mongoose");

const placementDriveSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true,
        },

        role: {
            type: String,
            required: true,
            trim: true,
        },

        package: {
            type: String,
            required: true,
            trim: true,
        },

        minCGPA: {
            type: Number,
            required: true,
            min: 0,
            max: 10,
        },

        department: {
            type: String,
            required: true,
            trim: true,
        },

        eligibleYear: {
            type: Number,
            required: true,
            min: 1,
            max: 4,
        },

        scheduleDate: {
            type: Date,
            required: true,
        },

        scheduleTime: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "PlacementDrive",
    placementDriveSchema
);