
import { useEffect, useState } from "react";
import theme from "../../styles/theme";

function SkillsCard() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error(
                        "Login token not found. Please login again."
                    );
                }

                const response = await fetch(
                    "http://localhost:5000/student/profile",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token} `,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = await response.json();

                console.log("SKILLS RESPONSE:", data);

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch skills"
                    );
                }

                setSkills(
                    Array.isArray(data.skills)
                        ? data.skills
                        : []
                );
            } catch (error) {
                console.error("Skills Error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    if (loading) {
        return (
            <div
                style={{
                    background: theme.colors.card,
                    padding: "25px",
                    borderRadius: "15px",
                    border: `1px solid ${theme.colors.border} `,
                }}
            >
                <h2>🛠 Skills</h2>
                <p>Loading skills...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    background: "#fee2e2",
                    color: "#991b1b",
                    padding: "20px",
                    borderRadius: "12px",
                }}
            >
                ⚠️ {error}
            </div>
        );
    }

    return (
        <div
            style={{
                background: theme.colors.card,
                padding: "25px",
                borderRadius: "15px",
                border: `1px solid ${theme.colors.border} `,
            }}
        >
            {/* Header */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        color: theme.colors.text,
                    }}
                >
                    🛠 Skills
                </h2>

                <span
                    style={{
                        background: "#ede9fe",
                        color: theme.colors.primary,
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontWeight: "600",
                    }}
                >
                    {skills.length} Skills
                </span>
            </div>

            {/* Skills */}

            {skills.length === 0 ? (
                <p
                    style={{
                        color: theme.colors.textSecondary,
                    }}
                >
                    No skills added yet.
                </p>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "12px",
                    }}
                >
                    {skills.map((skill, index) => (
                        <span
                            key={`${skill} -${index} `}
                            style={{
                                background:
                                    theme.colors.primary,
                                color: "white",
                                padding: "10px 16px",
                                borderRadius: "25px",
                                fontWeight: "600",
                                fontSize: "14px",
                            }}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SkillsCard;

