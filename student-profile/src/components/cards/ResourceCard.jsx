import { useNavigate } from "react-router-dom";
import theme from "../../styles/theme";

function ResourceCard({ resource }) {
    const navigate = useNavigate();

    const handleOpen = () => {
        navigate(`/resources/${resource.id}`);
    };

    return (
        <div
            style={{
                background: theme.colors.card,
                color: theme.colors.text,
                borderRadius: "15px",
                padding: "25px",
                border: `1px solid ${theme.colors.border}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "0.2s",
            }}
        >
            {/* ICON */}
            <div
                style={{
                    fontSize: "35px",
                    marginBottom: "15px",
                }}
            >
                📚
            </div>

            {/* TITLE */}
            <h2
                style={{
                    margin: "0 0 10px",
                    color: theme.colors.text,
                    fontSize: "22px",
                }}
            >
                {resource.title}
            </h2>

            {/* CATEGORY */}
            <span
                style={{
                    display: "inline-block",
                    background: theme.colors.primary,
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "15px",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "15px",
                }}
            >
                {resource.category}
            </span>

            {/* DESCRIPTION */}
            <p
                style={{
                    color: theme.colors.textSecondary,
                    lineHeight: "1.6",
                    margin: "10px 0 20px",
                }}
            >
                {resource.description}
            </p>

            {/* OPEN BUTTON */}
            <button
                onClick={handleOpen}
                style={{
                    background: theme.colors.primary,
                    color: "#fff",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                }}
            >
                Open Resource →
            </button>
        </div>
    );
}

export default ResourceCard;