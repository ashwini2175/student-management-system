
const mongoose = require("mongoose");

const trainingMaterialSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        year: {
            type: Number,
            required: true,
            enum: [1, 2, 3, 4],
        },

        category: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            enum: ["PDF", "Video", "Link", "Practice"],
            required: true,
        },

        link: {
            type: String,
            required: true,
        },

        uploadedBy: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "TrainingMaterial",
    trainingMaterialSchema
);