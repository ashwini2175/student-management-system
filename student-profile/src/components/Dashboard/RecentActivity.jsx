import theme from "../../styles/theme";

function RecentActivity({ student }) {
    const activities = [
        {
            title: "React Certificate Uploaded",
            time: "Recently",
            icon: "🏆",
        },
        {
            title: "Project Updated",
            time: "Recently",
            icon: "💻",
        },
        {
            title: "Resume Created",
            time: "Recently",
            icon: "📄",
        },
        {
            title: "Profile Updated",
            time: "Recently",
            icon: "👤",
        },
    ];

    return (
        <div
            style={{
                background: theme.colors.card,
                padding: "25px",
                borderRadius: "15px",
                border: `1px solid ${theme.colors.border}`,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
        >
            <h2
                style={{
                    marginBottom: "20px",
                    color: theme.colors.text,
                }}
            >
                📋 Recent Activity
            </h2>

            <div>
                {activities.map((activity) => (
                    <div
                        key={activity.title}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                            padding: "14px 0",
                            borderBottom: `1px solid ${theme.colors.border}`,
                        }}
                    >
                        <div
                            style={{
                                fontSize: "24px",
                                width: "40px",
                                textAlign: "center",
                            }}
                        >
                            {activity.icon}
                        </div>

                        <div>
                            <p
                                style={{
                                    margin: 0,
                                    fontWeight: "600",
                                    color: theme.colors.text,
                                }}
                            >
                                {activity.title}
                            </p>

                            <small
                                style={{
                                    color: theme.colors.textLight,
                                }}
                            >
                                {activity.time}
                            </small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentActivity;