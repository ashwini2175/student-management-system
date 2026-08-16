const mongoose = require("mongoose");

const guidanceSchema = new mongoose.Schema(
    {
        studentPRN: {
            type: String,
            required: true
        },

        teacherName: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model("Guidance", guidanceSchema);