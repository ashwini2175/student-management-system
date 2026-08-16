const express = require("express");
const router = express.Router();

const {
    addNotification,
    getAllNotifications,
    getNotificationsByPRN,
    markAsRead
} = require("../controllers/notificationController");

router.post("/", addNotification);

router.get("/", getAllNotifications);

router.get("/:prn", getNotificationsByPRN);

router.put("/read/:id", markAsRead);

module.exports = router;