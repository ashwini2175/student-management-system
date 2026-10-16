const mongoose = require("mongoose");

const guidanceSchema = new mongoose.Schema(
    {
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

        category: {
            type: String,
            default: "Career",
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
);

module.exports = mongoose.model("Guidance", guidanceSchema);