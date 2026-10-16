import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import theme from "../../styles/theme";
import SearchBar from "../common/SearchBar";
import ProfileDropdown from "../Profile/ProfileDropdown";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [notifications, setNotifications] = useState([]);

    const [loadingNotifications, setLoadingNotifications] =
        useState(false);

    const [selectedNotification, setSelectedNotification] =
        useState(null);

    const [unreadCount, setUnreadCount] = useState(0);

    // =========================================
    // GET LOGGED-IN STUDENT
    // =========================================

    const [student] = useState(() => {
        const savedStudent = localStorage.getItem("student");

        if (!savedStudent) {
            return null;
        }

        try {
            return JSON.parse(savedStudent);
        } catch (error) {
            console.error("Invalid student data:", error);
            return null;
        }
    });

    // =========================================
    // FETCH NOTIFICATIONS
    // =========================================

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            setLoadingNotifications(true);

            // Get latest student profile
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

            const currentStudent =
                await profileResponse.json();

            // Get student's notifications
            const response = await fetch(
                `http://localhost:5000/notification/${currentStudent.prn}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load notifications"
                );
            }

            const notificationList =
                Array.isArray(data) ? data : [];

            setNotifications(notificationList);

            // Calculate unread count
            const unread = notificationList.filter(
                (notification) => !notification.isRead
            ).length;

            console.log("NOTIFICATIONS:", notificationList);
            console.log("UNREAD COUNT:", unread);

            setUnreadCount(unread);

        } catch (error) {
            console.error(
                "Notification Error:",
                error
            );

            setNotifications([]);
            setUnreadCount(0);

        } finally {
            setLoadingNotifications(false);
        }
    };

    // =========================================
    // LOAD NOTIFICATIONS ON NAVBAR LOAD
    // =========================================

    useEffect(() => {
        fetchNotifications();
    }, []);

    // =========================================
    // BELL CLICK
    // =========================================

    const handleBellClick = () => {
        setShowNotifications(
            !showNotifications
        );

        // Close profile dropdown
        setIsOpen(false);

        // Fetch latest notifications
        if (!showNotifications) {
            fetchNotifications();
        }
    };

    // =========================================
    // NOTIFICATION CLICK
    // =========================================



    const handleNotificationClick = async (notification) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            // Open notification details
            setSelectedNotification(notification);

            // If already read, nothing else to do
            if (notification.isRead) {
                return;
            }

            // Mark notification as read in backend
            const response = await fetch(
                `http://localhost:5000/notification/read/${notification._id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to mark notification as read"
                );
            }

            console.log("Notification marked as read:", data);

            // Update notification locally
            setNotifications((prev) =>
                prev.map((item) =>
                    item._id === notification._id
                        ? { ...item, isRead: true }
                        : item
                )
            );

            // Decrease navbar unread count
            setUnreadCount((prev) =>
                prev > 0 ? prev - 1 : 0
            );

            // Also update selected notification
            setSelectedNotification((prev) =>
                prev
                    ? { ...prev, isRead: true }
                    : prev
            );

        } catch (error) {
            console.error(
                "Mark Notification Read Error:",
                error
            );
        }
    };

    // =========================================
    // CLOSE NOTIFICATION
    // =========================================

    const handleCloseNotification = () => {
        setSelectedNotification(null);
    };

    return (
        <div
            style={{
                height: "70px",
                background: theme.colors.navbar,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 30px",
                borderBottom:
                    `1px solid ${theme.colors.border}`,
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >

            {/* ================================= */}
            {/* LOGO */}
            {/* ================================= */}

            <h2
                style={{
                    color: theme.colors.primary,
                    margin: 0,
                }}
            >
                Student Portal
            </h2>

            {/* ================================= */}
            {/* RIGHT SIDE */}
            {/* ================================= */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                }}
            >

                <SearchBar />

                {/* ================================= */}
                {/* NOTIFICATION */}
                {/* ================================= */}

                <div
                    style={{
                        position: "relative",
                    }}
                >

                    {/* Bell */}

                    <div
                        onClick={handleBellClick}
                        style={{
                            position: "relative",
                            cursor: "pointer",
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <FaBell
                            size={20}
                            color={
                                theme.colors.text
                            }
                        />

                        {/* Unread Badge */}

                        {unreadCount > 0 && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: "0",
                                    right: "0",
                                    background: "#dc2626",
                                    color: "white",
                                    width: "18px",
                                    height: "18px",
                                    borderRadius: "50%",
                                    fontSize: "11px",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {unreadCount > 9
                                    ? "9+"
                                    : unreadCount}
                            </span>
                        )}
                    </div>

                    {/* ================================= */}
                    {/* NOTIFICATION DROPDOWN */}
                    {/* ================================= */}

                    {showNotifications && (
                        <div
                            style={{
                                position: "absolute",
                                right: 0,
                                top: "50px",
                                width: "330px",
                                background:
                                    theme.colors.card,
                                borderRadius: "12px",
                                boxShadow:
                                    "0 6px 25px rgba(0,0,0,0.2)",
                                border:
                                    `1px solid ${theme.colors.border}`,
                                overflow: "hidden",
                                zIndex: 1000,
                            }}
                        >

                            {/* Header */}

                            <div
                                style={{
                                    padding:
                                        "16px 18px",
                                    borderBottom:
                                        `1px solid ${theme.colors.border}`,
                                }}
                            >
                                <h3
                                    style={{
                                        margin: 0,
                                        color:
                                            theme.colors.text,
                                    }}
                                >
                                    🔔 Notifications
                                </h3>
                            </div>

                            {/* Loading */}

                            {loadingNotifications && (
                                <p
                                    style={{
                                        padding: "20px",
                                        color:
                                            theme.colors.textSecondary,
                                    }}
                                >
                                    Loading
                                    notifications...
                                </p>
                            )}

                            {/* No Notifications */}

                            {!loadingNotifications &&
                                notifications.length === 0 && (
                                    <div
                                        style={{
                                            padding:
                                                "30px 20px",
                                            textAlign:
                                                "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize:
                                                    "35px",
                                            }}
                                        >
                                            🔔
                                        </div>

                                        <p
                                            style={{
                                                color:
                                                    theme.colors
                                                        .textSecondary,
                                            }}
                                        >
                                            No notifications
                                        </p>
                                    </div>
                                )}

                            {/* ================================= */}
                            {/* SELECTED NOTIFICATION */}
                            {/* ================================= */}

                            {selectedNotification ? (
                                <div
                                    style={{
                                        padding: "20px",
                                    }}
                                >
                                    <h3
                                        style={{
                                            margin:
                                                "0 0 12px",
                                            color:
                                                theme.colors
                                                    .text,
                                        }}
                                    >
                                        {
                                            selectedNotification.title
                                        }
                                    </h3>

                                    <p
                                        style={{
                                            margin: 0,
                                            color:
                                                theme.colors
                                                    .textSecondary,
                                            lineHeight:
                                                "1.6",
                                        }}
                                    >
                                        {
                                            selectedNotification.message
                                        }
                                    </p>

                                    <small
                                        style={{
                                            display:
                                                "block",
                                            marginTop:
                                                "12px",
                                            color:
                                                theme.colors
                                                    .textSecondary,
                                        }}
                                    >
                                        {selectedNotification.createdAt
                                            ? new Date(
                                                selectedNotification.createdAt
                                            ).toLocaleString()
                                            : ""}
                                    </small>

                                    {/* Close */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleCloseNotification
                                        }
                                        style={{
                                            marginTop:
                                                "18px",
                                            border: "none",
                                            background:
                                                theme.colors
                                                    .primary,
                                            color: "white",
                                            padding:
                                                "8px 16px",
                                            borderRadius:
                                                "7px",
                                            cursor: "pointer",
                                            fontWeight:
                                                "600",
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (

                                /* ================================= */
                                /* NOTIFICATION HEADINGS */
                                /* ================================= */

                                !loadingNotifications &&
                                notifications.map(
                                    (notification) => (
                                        <div
                                            key={
                                                notification._id
                                            }
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification
                                                )
                                            }
                                            style={{
                                                padding:
                                                    "15px 18px",
                                                borderBottom:
                                                    `1px solid ${theme.colors.border}`,
                                                cursor: "pointer",
                                                background:
                                                    notification.isRead
                                                        ? "transparent"
                                                        : "#f3f4f6",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "space-between",
                                                    gap: "10px",
                                                }}
                                            >
                                                <strong
                                                    style={{
                                                        color:
                                                            theme.colors
                                                                .text,
                                                        fontSize:
                                                            "14px",
                                                    }}
                                                >
                                                    {
                                                        notification.title
                                                    }
                                                </strong>

                                                {/* Unread Dot */}

                                                {!notification.isRead && (
                                                    <span
                                                        style={{
                                                            width:
                                                                "8px",
                                                            height:
                                                                "8px",
                                                            background:
                                                                "#2563eb",
                                                            borderRadius:
                                                                "50%",
                                                            flexShrink:
                                                                0,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* ================================= */}
                {/* PROFILE */}
                {/* ================================= */}

                <div
                    style={{
                        position: "relative",
                    }}
                >

                    {/* Online */}

                    <div
                        style={{
                            position: "absolute",
                            top: "-2px",
                            right: "-2px",
                            width: "10px",
                            height: "10px",
                            background:
                                theme.colors.success,
                            borderRadius: "50%",
                            border: "2px solid white",
                            zIndex: 2,
                        }}
                    />

                    {/* Profile Circle */}

                    <div
                        onClick={() => {
                            setIsOpen(!isOpen);
                            setShowNotifications(false);
                        }}
                        style={{
                            width: "45px",
                            height: "45px",
                            borderRadius: "50%",
                            background:
                                theme.colors.primary,
                            color: "white",
                            display: "flex",
                            justifyContent:
                                "center",
                            alignItems: "center",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "18px",
                        }}
                    >
                        {student?.name
                            ?.charAt(0)
                            .toUpperCase() || "S"}
                    </div>

                    {isOpen && (
                        <ProfileDropdown />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;