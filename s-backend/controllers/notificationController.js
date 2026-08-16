const Notification = require("../models/Notification");

// =============================
// Add Notification
// POST /notification
// =============================
const addNotification = async (req, res) => {
    try {

        const notification = new Notification(req.body);

        await notification.save();

        res.status(201).json({
            message: "Notification Created Successfully",
            notification
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// =============================
// Get All Notifications
// GET /notification
// =============================
const getAllNotifications = async (req, res) => {
    try {

        const notifications = await Notification.find()
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// =============================
// Get Notifications By PRN
// GET /notification/:prn
// =============================
const getNotificationsByPRN = async (req, res) => {
    try {

        const notifications = await Notification.find({
            studentPRN: req.params.prn
        }).sort({ createdAt: -1 });

        res.status(200).json(notifications);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// =============================
// Mark Notification As Read
// PUT /notification/read/:id
// =============================
const markAsRead = async (req, res) => {
    try {

        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                message: "Notification Not Found"
            });
        }

        res.status(200).json({
            message: "Notification Marked as Read",
            notification
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    addNotification,
    getAllNotifications,
    getNotificationsByPRN,
    markAsRead
};