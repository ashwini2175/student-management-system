import theme from "../../styles/theme";

function RecentActivityCard() {
    const activities = [
        {
            id: 1,
            title: "React Certificate Uploaded",
            time: "2 hours ago",
        },
        {
            id: 2,
            title: "Project Updated",
            time: "Yesterday",
        },
        {
            id: 3,
            title: "Profile Completed",
            time: "2 days ago",
        },
    ];

    return (
        <div
            style={{
                background: theme.colors.card,
                borderRadius: "15px",
                padding: "20px",
                boxShadow: theme.colors.shadow,
                border: `1px solid ${theme.colors.border}`,
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

            {activities.map((activity) => (
                <div
                    key={activity.id}
                    style={{
                        padding: "12px 0",
                        borderBottom: `1px solid ${theme.colors.border}`,
                    }}
                >
                    <h4
                        style={{
                            margin: 0,
                            color: theme.colors.text,
                        }}
                    >
                        {activity.title}
                    </h4>

                    <p
                        style={{
                            marginTop: "5px",
                            color: theme.colors.textSecondary,
                            fontSize: "14px",
                        }}
                    >
                        {activity.time}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default RecentActivityCard;