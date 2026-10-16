import { useEffect, useState } from "react";
import theme from "../styles/theme";

function Career() {
    // =========================================
    // STUDENT
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
    // GUIDANCE STATE
    // =========================================

    const [guidance, setGuidance] = useState([]);
    const [loadingGuidance, setLoadingGuidance] = useState(true);
    const [guidanceError, setGuidanceError] = useState("");

    // =========================================
    // EXISTING CAREER DATA
    // =========================================

    const skills = [
        { name: "React", progress: 85 },
        { name: "JavaScript", progress: 80 },
        { name: "Node.js", progress: 60 },
        { name: "MongoDB", progress: 65 },
        { name: "DSA", progress: 55 },
    ];

    const placementDrives = [
        {
            company: "TCS",
            role: "Software Developer",
            eligibility: "CGPA 7.0+",
            package: "7 LPA",
            date: "Coming Soon",
        },
        {
            company: "Infosys",
            role: "Systems Engineer",
            eligibility: "CGPA 6.5+",
            package: "6 LPA",
            date: "Coming Soon",
        },
    ];

    // =========================================
    // FETCH GUIDANCE


    // =========================================
    // LOAD GUIDANCE
    useEffect(() => {
        let isMounted = true;

        const loadGuidance = async () => {
            try {
                setLoadingGuidance(true);
                setGuidanceError("");

                if (!student?.prn) {
                    throw new Error("Student PRN not found.");
                }

                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("Login token not found. Please login again.");
                }

                const response = await fetch(
                    `http://localhost:5000/guidance/${student.prn}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = await response.json();

                console.log("GUIDANCE RESPONSE:", data);

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch guidance"
                    );
                }

                if (isMounted) {
                    setGuidance(Array.isArray(data) ? data : []);
                }

            } catch (error) {
                console.error("Guidance Error:", error);

                if (isMounted) {
                    setGuidanceError(error.message);
                }

            } finally {
                if (isMounted) {
                    setLoadingGuidance(false);
                }
            }
        };

        loadGuidance();

        return () => {
            isMounted = false;
        };
    }, [student?.prn]);

    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div
            style={{
                width: "100%",
            }}
        >
            {/* ================= HEADER ================= */}

            <h1
                style={{
                    color: theme.colors.primary,
                    marginBottom: "8px",
                }}
            >
                💼 Career & Placement
            </h1>

            <p
                style={{
                    color: theme.colors.textSecondary,
                    marginBottom: "30px",
                    fontSize: "16px",
                }}
            >
                Track your placement readiness and prepare for upcoming
                career opportunities.
            </p>

            {/* ================= PLACEMENT OVERVIEW ================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    marginBottom: "35px",
                }}
            >
                {/* Available Companies */}

                <div
                    style={{
                        background: theme.colors.card,
                        padding: "22px",
                        borderRadius: "15px",
                        border: `1px solid ${theme.colors.border}`,
                    }}
                >
                    <div style={{ fontSize: "30px" }}>🏢</div>

                    <h2
                        style={{
                            color: theme.colors.primary,
                            margin: "10px 0",
                        }}
                    >
                        {placementDrives.length}
                    </h2>

                    <p
                        style={{
                            color: theme.colors.text,
                            margin: 0,
                        }}
                    >
                        Available Companies
                    </p>
                </div>

                {/* Placement Drives */}

                <div
                    style={{
                        background: theme.colors.card,
                        padding: "22px",
                        borderRadius: "15px",
                        border: `1px solid ${theme.colors.border}`,
                    }}
                >
                    <div style={{ fontSize: "30px" }}>📢</div>

                    <h2
                        style={{
                            color: theme.colors.primary,
                            margin: "10px 0",
                        }}
                    >
                        {placementDrives.length}
                    </h2>

                    <p
                        style={{
                            color: theme.colors.text,
                            margin: 0,
                        }}
                    >
                        Placement Drives
                    </p>
                </div>

                {/* Placement Readiness */}

                <div
                    style={{
                        background: theme.colors.card,
                        padding: "22px",
                        borderRadius: "15px",
                        border: `1px solid ${theme.colors.border}`,
                    }}
                >
                    <div style={{ fontSize: "30px" }}>🎯</div>

                    <h2
                        style={{
                            color: theme.colors.primary,
                            margin: "10px 0",
                        }}
                    >
                        82%
                    </h2>

                    <p
                        style={{
                            color: theme.colors.text,
                            margin: 0,
                        }}
                    >
                        Placement Readiness
                    </p>
                </div>
            </div>

            {/* ================= UPCOMING PLACEMENT DRIVES ================= */}

            <h2
                style={{
                    color: theme.colors.primary,
                    marginBottom: "20px",
                }}
            >
                📢 Upcoming Placement Drives
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "20px",
                    marginBottom: "35px",
                }}
            >
                {placementDrives.map((drive) => (
                    <div
                        key={drive.company}
                        style={{
                            background: theme.colors.card,
                            padding: "22px",
                            borderRadius: "15px",
                            border: `1px solid ${theme.colors.border}`,
                            minHeight: "250px",
                            boxSizing: "border-box",
                        }}
                    >
                        <h2
                            style={{
                                color: theme.colors.text,
                                marginTop: 0,
                                marginBottom: "18px",
                            }}
                        >
                            🏢 {drive.company}
                        </h2>

                        <p
                            style={{
                                color: theme.colors.textSecondary,
                                margin: "10px 0",
                            }}
                        >
                            <strong>Role:</strong> {drive.role}
                        </p>

                        <p
                            style={{
                                color: theme.colors.textSecondary,
                                margin: "10px 0",
                            }}
                        >
                            <strong>Eligibility:</strong>{" "}
                            {drive.eligibility}
                        </p>

                        <p
                            style={{
                                color: theme.colors.textSecondary,
                                margin: "10px 0",
                            }}
                        >
                            <strong>Package:</strong> {drive.package}
                        </p>

                        <p
                            style={{
                                color: theme.colors.textSecondary,
                                margin: "10px 0",
                            }}
                        >
                            <strong>Drive Date:</strong> {drive.date}
                        </p>

                        <button
                            style={{
                                marginTop: "10px",
                                padding: "10px 16px",
                                border: "none",
                                borderRadius: "8px",
                                background: theme.colors.primary,
                                color: "#ffffff",
                                cursor: "pointer",
                            }}
                        >
                            View Details →
                        </button>
                    </div>
                ))}
            </div>

            {/* ================= PLACEMENT READINESS ================= */}

            <h2
                style={{
                    color: theme.colors.primary,
                    marginBottom: "20px",
                }}
            >
                🎯 Placement Readiness
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "20px",
                    marginBottom: "35px",
                }}
            >
                <div
                    style={{
                        background: theme.colors.card,
                        padding: "22px",
                        borderRadius: "15px",
                        border: `1px solid ${theme.colors.border}`,
                        minHeight: "250px",
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                            marginBottom: "22px",
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    color: theme.colors.primary,
                                    margin: 0,
                                    fontSize: "38px",
                                }}
                            >
                                82%
                            </h1>

                            <p
                                style={{
                                    color: theme.colors.textSecondary,
                                    margin: "5px 0 0",
                                    fontSize: "14px",
                                }}
                            >
                                Overall Readiness
                            </p>
                        </div>
                    </div>

                    {skills.map((skill) => (
                        <div
                            key={skill.name}
                            style={{
                                marginBottom: "14px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "5px",
                                    color: theme.colors.text,
                                    fontSize: "14px",
                                    fontWeight: "600",
                                }}
                            >
                                <span>{skill.name}</span>
                                <span>{skill.progress}%</span>
                            </div>

                            <div
                                style={{
                                    width: "100%",
                                    height: "8px",
                                    background: "#e5e7eb",
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        width: `${skill.progress}%`,
                                        height: "100%",
                                        background: theme.colors.primary,
                                        borderRadius: "20px",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>



            <h2
                style={{
                    color: theme.colors.primary,
                    marginBottom: "20px",
                }}
            >
                🧭 Career Guidance
            </h2>

            {guidanceError && (
                <div
                    style={{
                        background: "#fee2e2",
                        color: "#991b1b",
                        padding: "15px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                    }}
                >
                    ⚠️ {guidanceError}
                </div>
            )}

            {loadingGuidance ? (
                <div
                    style={{
                        background: theme.colors.card,
                        padding: "25px",
                        borderRadius: "15px",
                        border: `1px solid ${theme.colors.border}`,
                        marginBottom: "35px",
                    }}
                >
                    <p
                        style={{
                            color: theme.colors.textSecondary,
                            margin: 0,
                        }}
                    >
                        Loading career guidance...
                    </p>
                </div>
            ) : guidance.length === 0 ? (
                <div
                    style={{
                        background: theme.colors.card,
                        padding: "30px",
                        borderRadius: "15px",
                        border: `1px solid ${theme.colors.border}`,
                        textAlign: "center",
                        marginBottom: "35px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "40px",
                            marginBottom: "10px",
                        }}
                    >
                        🧭
                    </div>

                    <h3
                        style={{
                            color: theme.colors.text,
                            marginBottom: "8px",
                        }}
                    >
                        No Guidance Available
                    </h3>

                    <p
                        style={{
                            color: theme.colors.textSecondary,
                            margin: 0,
                        }}
                    >
                        Your teacher has not added any career guidance yet.
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "20px",
                        marginBottom: "35px",
                    }}
                >
                    {guidance.map((item) => (
                        <div
                            key={item._id}
                            style={{
                                background: theme.colors.card,
                                padding: "22px",
                                borderRadius: "15px",
                                border: `1px solid ${theme.colors.border}`,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: "15px",
                                    marginBottom: "15px",
                                }}
                            >
                                <h3
                                    style={{
                                        color: theme.colors.text,
                                        margin: 0,
                                    }}
                                >
                                    {item.title}
                                </h3>

                                <span
                                    style={{
                                        background:
                                            theme.colors.primary,
                                        color: "white",
                                        padding: "5px 10px",
                                        borderRadius: "15px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {item.category || "Career"}
                                </span>
                            </div>

                            <p
                                style={{
                                    color: theme.colors.textSecondary,
                                    lineHeight: "1.7",
                                    marginBottom: "15px",
                                }}
                            >
                                {item.message}
                            </p>

                            {item.createdAt && (
                                <p
                                    style={{
                                        color:
                                            theme.colors.textSecondary,
                                        fontSize: "13px",
                                        margin: 0,
                                    }}
                                >
                                    📅 {formatDate(item.createdAt)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Career;