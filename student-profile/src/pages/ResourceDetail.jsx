import { useParams, useNavigate } from "react-router-dom";
import student from "../data/student";
import theme from "../styles/theme";

function ResourceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const resource = student.resources.find(
        (item) => String(item.id) === String(id)
    );

    // Resource not found
    if (!resource) {
        return (
            <div
                style={{
                    padding: "40px",
                    textAlign: "center",
                    color: theme.colors.text,
                }}
            >
                <h1>Resource Not Found</h1>

                <p
                    style={{
                        color: theme.colors.textSecondary,
                    }}
                >
                    The requested resource does not exist.
                </p>

                <button
                    onClick={() => navigate("/resources")}
                    style={{
                        background: theme.colors.primary,
                        color: "#fff",
                        border: "none",
                        padding: "12px 22px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                >
                    ← Back to Resources
                </button>
            </div>
        );
    }

    return (
        <div
            style={{
                maxWidth: "1000px",
                margin: "0 auto",
                padding: "30px",
            }}
        >
            {/* BACK BUTTON */}

            <button
                onClick={() => navigate("/resources")}
                style={{
                    background: "transparent",
                    border: "none",
                    color: theme.colors.primary,
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "25px",
                }}
            >
                ← Back to Resources
            </button>

            {/* RESOURCE CARD */}

            <div
                style={{
                    background: theme.colors.card,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: "20px",
                    padding: "40px",
                }}
            >
                {/* ICON */}

                <div
                    style={{
                        fontSize: "55px",
                        marginBottom: "15px",
                    }}
                >
                    📚
                </div>

                {/* TITLE */}

                <h1
                    style={{
                        color: theme.colors.text,
                        marginBottom: "15px",
                    }}
                >
                    {resource.title}
                </h1>

                {/* CATEGORY */}

                <span
                    style={{
                        display: "inline-block",
                        background: theme.colors.primary,
                        color: "#fff",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "600",
                    }}
                >
                    {resource.category}
                </span>

                {/* DESCRIPTION */}

                <div
                    style={{
                        marginTop: "30px",
                    }}
                >
                    <h2
                        style={{
                            color: theme.colors.text,
                        }}
                    >
                        About this Resource
                    </h2>

                    <p
                        style={{
                            color: theme.colors.textSecondary,
                            fontSize: "17px",
                            lineHeight: "1.7",
                        }}
                    >
                        {resource.description}
                    </p>
                </div>

                {/* RESOURCE INFORMATION */}

                <div
                    style={{
                        marginTop: "30px",
                        padding: "20px",
                        background: "#f8fafc",
                        borderRadius: "12px",
                    }}
                >
                    <h3
                        style={{
                            marginTop: 0,
                            color: theme.colors.text,
                        }}
                    >
                        📌 Resource Information
                    </h3>

                    <p>
                        <strong>Title:</strong>{" "}
                        {resource.title}
                    </p>

                    <p>
                        <strong>Category:</strong>{" "}
                        {resource.category}
                    </p>

                    <p>
                        <strong>Purpose:</strong>{" "}
                        Placement Preparation
                    </p>
                </div>

                {/* ACTION */}

                <div
                    style={{
                        marginTop: "30px",
                    }}
                >
                    <button
                        onClick={() => navigate("/resources")}
                        style={{
                            background: theme.colors.primary,
                            color: "#fff",
                            border: "none",
                            padding: "12px 25px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                        }}
                    >
                        ← Back to All Resources
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResourceDetail;