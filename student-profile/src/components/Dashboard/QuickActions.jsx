import { useNavigate } from "react-router-dom";
import theme from "../../styles/theme";

function QuickActions() {
    const navigate = useNavigate();

    const buttons = [
        {
            label: "Add Project",
            icon: "💻",
            path: "/projects",
        },
        {
            label: "Upload Certificate",
            icon: "📜",
            path: "/certificates",
        },
        {
            label: "View Resources",
            icon: "📚",
            path: "/resources",
        },
        {
            label: "Update Profile",
            icon: "👤",
            path: "/profile",
        },
    ];

    return (
        <div
            style={{
                marginTop: "25px",
            }}
        >
            <h2
                style={{
                    marginBottom: "15px",
                    color: theme.colors.text,
                }}
            >
                ⚡ Quick Actions
            </h2>

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    flexWrap: "wrap",
                }}
            >
                {buttons.map((button) => (
                    <button
                        key={button.label}
                        onClick={() => navigate(button.path)}
                        style={{
                            padding: "13px 20px",
                            borderRadius: "10px",
                            border: `1px solid ${theme.colors.border}`,
                            background: theme.colors.primary,
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "600",
                            transition: "0.2s",
                        }}
                    >
                        {button.icon} {button.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default QuickActions;