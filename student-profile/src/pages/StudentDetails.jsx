import { useLocation, useNavigate } from "react-router-dom";
import theme from "../styles/theme";

function StudentDetails() {
    const navigate = useNavigate();
    const location = useLocation();

    // Receive the selected student from the Students page
    const student = location.state?.student;

    if (!student) {
        return (
            <div style={styles.empty}>
                <h2>No student selected</h2>

                <p>
                    Please return to the Students page
                    and select a student.
                </p>

                <button
                    onClick={() => navigate("/teacher/students")}
                    style={styles.button}
                >
                    ← Back to Students
                </button>
            </div>
        );
    }

    const skills = Array.isArray(student.skills)
        ? student.skills
        : [];

    return (
        <div style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <button
                    onClick={() => navigate("/teacher/students")}
                    style={styles.backButton}
                >
                    ← Back to Students
                </button>

                <span
                    style={{
                        ...styles.status,
                        ...getStatusStyle(student.placementStatus),
                    }}
                >
                    {student.placementStatus || "Status not available"}
                </span>
            </div>

            {/* Student profile */}
            <div style={styles.profileCard}>
                <div style={styles.avatar}>
                    {(student.name || "S")
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <div>
                    <h1 style={styles.name}>
                        {student.name || "Student"}
                    </h1>

                    <p style={styles.prn}>
                        PRN: {student.prn || "Not available"}
                    </p>

                    <p style={styles.department}>
                        {student.department || "Department not available"}
                    </p>
                </div>
            </div>

            {/* Academic information */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    🎓 Academic Information
                </h2>

                <div style={styles.infoGrid}>
                    <Info
                        label="Department"
                        value={student.department || "Not available"}
                    />

                    <Info
                        label="Academic Year"
                        value={
                            student.year
                                ? student.year === 4
                                    ? "Final Year"
                                    : `Year ${student.year}`
                                : "Not available"
                        }
                    />

                    <Info
                        label="CGPA"
                        value={student.cgpa ?? "Not available"}
                    />

                    <Info
                        label="Placement Score"
                        value={student.placementScore ?? "Not available"}
                    />
                </div>
            </section>

            {/* Placement information */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    💼 Placement Information
                </h2>

                <div style={styles.infoGrid}>
                    <Info
                        label="Placement Status"
                        value={
                            student.placementStatus || "Not available"
                        }
                    />

                    <Info
                        label="Placement Score"
                        value={
                            student.placementScore != null
                                ? `${student.placementScore}/100`
                                : "Not available"
                        }
                    />
                </div>
            </section>

            {/* Skills */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    🛠 Technical Skills
                </h2>

                {skills.length > 0 ? (
                    <div style={styles.skills}>
                        {skills.map((skill, index) => (
                            <span
                                key={`${skill}-${index}`}
                                style={styles.skill}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p style={styles.muted}>
                        No skills have been added yet.
                    </p>
                )}
            </section>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div style={styles.infoItem}>
            <span style={styles.label}>{label}</span>
            <strong style={styles.value}>{value}</strong>
        </div>
    );
}

function getStatusStyle(status) {
    if (status === "Placement Ready") {
        return {
            background: "#dcfce7",
            color: "#166534",
        };
    }

    if (status === "Immediate Attention") {
        return {
            background: "#fee2e2",
            color: "#991b1b",
        };
    }

    return {
        background: "#fef3c7",
        color: "#92400e",
    };
}

const styles = {
    page: {
        paddingBottom: "30px",
        color: theme.colors.text,
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "25px",
    },

    backButton: {
        border: "none",
        background: "transparent",
        color: theme.colors.primary,
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "600",
        padding: "8px 0",
    },

    status: {
        padding: "8px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600",
    },

    profileCard: {
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "16px",
        padding: "30px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
    },

    avatar: {
        width: "75px",
        height: "75px",
        minWidth: "75px",
        borderRadius: "50%",
        background: theme.colors.primary,
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "30px",
        fontWeight: "700",
    },

    name: {
        margin: 0,
        fontSize: "27px",
        color: theme.colors.text,
    },

    prn: {
        margin: "8px 0",
        color: theme.colors.textSecondary,
    },

    department: {
        margin: 0,
        color: theme.colors.textSecondary,
        fontSize: "14px",
    },

    section: {
        marginTop: "25px",
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "16px",
        padding: "25px",
    },

    sectionTitle: {
        marginTop: 0,
        marginBottom: "20px",
        fontSize: "20px",
        color: theme.colors.text,
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
    },

    infoItem: {
        padding: "16px",
        background: "#f8fafc",
        borderRadius: "10px",
        minWidth: 0,
    },

    label: {
        display: "block",
        color: "#64748b",
        fontSize: "12px",
        marginBottom: "8px",
    },

    value: {
        color: "#1e293b",
        fontSize: "16px",
        overflowWrap: "anywhere",
    },

    skills: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
    },

    skill: {
        background: "#eef2ff",
        color: "#3730a3",
        padding: "8px 13px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600",
    },

    muted: {
        color: theme.colors.textSecondary,
    },

    button: {
        marginTop: "15px",
        background: theme.colors.primary,
        color: "#ffffff",
        border: "none",
        padding: "11px 20px",
        borderRadius: "8px",
        cursor: "pointer",
    },

    empty: {
        textAlign: "center",
        padding: "70px 20px",
        color: theme.colors.text,
    },
};

export default StudentDetails;