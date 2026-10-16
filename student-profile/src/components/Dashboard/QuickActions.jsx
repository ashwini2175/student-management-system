import { useNavigate } from "react-router-dom";
import theme from "../../styles/theme";

function QuickActions() {
    const navigate = useNavigate();

    const actions = [
        {
            title: "Add Project",
            icon: "➕",
            path: "/projects",
        },
        {
            title: "Upload Certificate",
            icon: "📤",
            path: "/certificates",
        },
        {
            title: "View Resources",
            icon: "📚",
            path: "/resources",
        },
        {
            title: "Update Profile",
            icon: "👤",
            path: "/profile",
        },
    ];

    return (
        <div
            style={{
                background: theme.colors.card,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: "16px",
                padding: "24px",
            }}
        >
            <h2
                style={{
                    marginTop: 0,
                    color: theme.colors.text,
                }}
            >
                Quick Actions
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "15px",
                }}
            >
                {actions.map((action) => (
                    <button
                        key={action.title}
                        onClick={() => navigate(action.path)}
                        style={{
                            padding: "16px",
                            borderRadius: "10px",
                            border: `1px solid ${theme.colors.border}`,
                            background: theme.colors.background,
                            color: theme.colors.text,
                            cursor: "pointer",
                            fontWeight: "600",
                            textAlign: "left",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "22px",
                                marginRight: "10px",
                            }}
                        >
                            {action.icon}
                        </span>

                        {action.title}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default QuickActions;