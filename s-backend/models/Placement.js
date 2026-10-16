const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
            trim: true,
        },

        role: {
            type: String,
            required: true,
            trim: true,
        },

        eligibilityCGPA: {
            type: Number,
            required: true,
            min: 0,
            max: 10,
        },

        package: {
            type: String,
            required: true,
            trim: true,
        },

        driveDate: {
            type: String,
            required: true,
        },

        time: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
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

module.exports = mongoose.model("Placement", placementSchema);