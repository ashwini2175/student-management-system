import theme from "../styles/theme";

function Notifications() {
    const notifications = [
        {
            id: 1,
            title: "Placement Drive",
            message: "TCS campus recruitment drive is scheduled soon. Check the Career section for details.",
            time: "Today",
            type: "💼",
        },
        {
            id: 2,
            title: "Training Material Available",
            message: "New aptitude and coding preparation material is available for your academic year.",
            time: "2 hours ago",
            type: "📚",
        },
        {
            id: 3,
            title: "Interview Preparation",
            message: "Interview preparation sessions have been updated. Practice technical and HR questions.",
            time: "Yesterday",
            type: "🎯",
        },
        {
            id: 4,
            title: "Resume Preparation",
            message: "Resume and placement preparation guidance is now available for students.",
            time: "Yesterday",
            type: "📄",
        },
    ];

    return (
        <div>
            <h1
                style={{
                    color: theme.colors.primary,
                    marginBottom: "8px",
                }}
            >
                🔔 Notifications
            </h1>

            <p
                style={{
                    color: "#cbd5e1",
                    marginBottom: "25px",
                }}
            >
                Stay updated with training and placement activities.
            </p>

            {/* notification cards below */}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                }}
            >
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        style={{
                            background: theme.colors.card,
                            padding: "20px",
                            borderRadius: "12px",
                            border: `1px solid ${theme.colors.border}`,
                            boxShadow: theme.colors.shadow,
                        }}
                    >
                        <h3
                            style={{
                                margin: 0,
                                color: theme.colors.text,
                            }}
                        >
                            {notification.type} {notification.title}
                        </h3>

                        <p
                            style={{
                                color: theme.colors.textSecondary,
                                marginTop: "8px",
                                lineHeight: "1.6",
                            }}
                        >
                            {notification.message}
                        </p>

                        <small
                            style={{
                                color: theme.colors.textSecondary,
                            }}
                        >
                            {notification.time}
                        </small>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notifications;