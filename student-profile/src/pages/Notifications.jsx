import React, { useEffect, useState } from "react";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");

                // 1. Get logged-in student profile
                const profileResponse = await fetch(
                    "http://localhost:5000/student/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!profileResponse.ok) {
                    throw new Error("Failed to fetch student profile");
                }

                const student = await profileResponse.json();

                // 2. Use logged-in student's PRN
                const notificationResponse = await fetch(
                    `http://localhost:5000/notification/${student.prn}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!notificationResponse.ok) {
                    throw new Error("Failed to fetch notifications");
                }

                const data = await notificationResponse.json();

                setNotifications(data);
            } catch (err) {
                console.error("Notification Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) {
        return <p>Loading notifications...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={{ padding: "30px" }}>
            <h1>Notifications</h1>

            {notifications.length === 0 ? (
                <p>No notifications available.</p>
            ) : (
                notifications.map((notification) => (
                    <div
                        key={notification._id}
                        style={{
                            background: "#fff",
                            padding: "18px",
                            marginBottom: "15px",
                            borderRadius: "10px",
                            position: "relative",
                        }}
                    >
                        {!notification.isRead && (
                            <span
                                style={{
                                    position: "absolute",
                                    right: "15px",
                                    top: "15px",
                                    width: "10px",
                                    height: "10px",
                                    background: "red",
                                    borderRadius: "50%",
                                }}
                            />
                        )}

                        <h3>{notification.title}</h3>

                        <p>{notification.message}</p>

                        <small>
                            {notification.createdAt
                                ? new Date(notification.createdAt).toLocaleString()
                                : ""}
                        </small>
                    </div>
                ))
            )}
        </div>
    );
};

export default Notifications;