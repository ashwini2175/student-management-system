const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    studentPRN: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    isRead: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Notification", notificationSchema);