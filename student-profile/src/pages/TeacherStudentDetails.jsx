import { useLocation, useNavigate } from "react-router-dom";
import theme from "../styles/theme";

function TeacherStudentDetails() {
    const navigate = useNavigate();
    const location = useLocation();

    const student = location.state?.student;

    if (!student) {
        return (
            <div style={styles.empty}>
                <h2>No Student Selected</h2>

                <p>
                    Please select a student from the Students page.
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

    return (
        <div style={styles.page}>

            {/* HEADER */}

            <div style={styles.header}>

                <button
                    onClick={() =>
                        navigate("/teacher/students")
                    }
                    style={styles.backButton}
                >
                    ← Back to Students
                </button>

                <div style={styles.headerContent}>
                    <div style={styles.avatar}>
                        {student.name
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <h1 style={styles.title}>
                            {student.name}
                        </h1>

                        <p style={styles.prn}>
                            PRN: {student.prn}
                        </p>
                    </div>
                </div>

            </div>

            {/* STATUS */}

            <div style={styles.statusCard}>

                <div>
                    <span style={styles.smallLabel}>
                        Placement Status
                    </span>

                    <h2 style={styles.status}>
                        {student.placementStatus}
                    </h2>
                </div>

                <div style={styles.score}>
                    {student.placementScore}
                    <span>/100</span>
                </div>

            </div>

            {/* BASIC INFORMATION */}

            <section style={styles.section}>

                <h2 style={styles.sectionTitle}>
                    🎓 Academic Information
                </h2>

                <div style={styles.infoGrid}>

                    <InfoItem
                        label="Department"
                        value={student.department}
                    />

                    <InfoItem
                        label="Year"
                        value={
                            student.year === 4
                                ? "Final Year"
                                : `Year ${student.year}`
                        }
                    />

                    <InfoItem
                        label="CGPA"
                        value={student.cgpa}
                    />

                    <InfoItem
                        label="Placement Score"
                        value={`${student.placementScore}/100`}
                    />

                </div>

            </section>

            {/* SKILLS */}

            <section style={styles.section}>

                <h2 style={styles.sectionTitle}>
                    💻 Skills
                </h2>

                <div style={styles.skills}>

                    {student.skills?.map(
                        (skill, index) => (
                            <span
                                key={index}
                                style={styles.skill}
                            >
                                {skill}
                            </span>
                        )
                    )}

                </div>

            </section>

            {/* CAREER */}

            <section style={styles.section}>

                <h2 style={styles.sectionTitle}>
                    🚀 Career & Placement
                </h2>

                <div style={styles.careerGrid}>

                    <InfoItem
                        label="Placement Status"
                        value={student.placementStatus}
                    />

                    <InfoItem
                        label="Placement Score"
                        value={`${student.placementScore}/100`}
                    />

                    <InfoItem
                        label="Career Readiness"
                        value={
                            student.placementScore >= 80
                                ? "High"
                                : student.placementScore >= 50
                                    ? "Moderate"
                                    : "Needs Improvement"
                        }
                    />

                </div>

            </section>

            {/* ACTIONS */}

            <section style={styles.section}>

                <h2 style={styles.sectionTitle}>
                    ⚡ Teacher Actions
                </h2>

                <div style={styles.actions}>

                    <button
                        style={styles.actionButton}
                        onClick={() =>
                            alert(
                                `Career guidance for ${student.name}`
                            )
                        }
                    >
                        🧭 Give Guidance
                    </button>

                    <button
                        style={styles.actionButton}
                        onClick={() =>
                            alert(
                                `View projects of ${student.name}`
                            )
                        }
                    >
                        📁 View Projects
                    </button>

                    <button
                        style={styles.actionButton}
                        onClick={() =>
                            alert(
                                `View certificates of ${student.name}`
                            )
                        }
                    >
                        🏆 Certificates
                    </button>

                </div>

            </section>

        </div>
    );
}


/* =========================================
   INFO ITEM
========================================= */

function InfoItem({ label, value }) {
    return (
        <div style={styles.infoItem}>

            <span style={styles.smallLabel}>
                {label}
            </span>

            <strong style={styles.infoValue}>
                {value}
            </strong>

        </div>
    );
}


/* =========================================
   STYLES
========================================= */

const styles = {

    page: {
        padding: "30px",
        minHeight: "100vh",
        background: "#f5f7fb",
        boxSizing: "border-box",
    },

    header: {
        marginBottom: "25px",
    },

    backButton: {
        border: "none",
        background: "transparent",
        color: theme.colors.primary,
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        marginBottom: "20px",
    },

    headerContent: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
    },

    avatar: {
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        background: theme.colors.primary,
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "30px",
        fontWeight: "700",
    },

    title: {
        margin: 0,
        color: theme.colors.text,
        fontSize: "30px",
    },

    prn: {
        margin: "5px 0 0",
        color: theme.colors.textSecondary,
    },

    statusCard: {
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "15px",
        padding: "22px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
    },

    status: {
        margin: "5px 0 0",
        color: theme.colors.primary,
    },

    score: {
        fontSize: "32px",
        fontWeight: "700",
        color: theme.colors.primary,
    },

    scoreSpan: {
        fontSize: "15px",
    },

    section: {
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "15px",
        padding: "25px",
        marginBottom: "20px",
    },

    sectionTitle: {
        marginTop: 0,
        marginBottom: "20px",
        color: theme.colors.text,
        fontSize: "20px",
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
    },

    careerGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
    },

    infoItem: {
        padding: "15px",
        borderRadius: "10px",
        background: "#f8fafc",
    },

    smallLabel: {
        display: "block",
        fontSize: "12px",
        color: theme.colors.textSecondary,
        marginBottom: "6px",
    },

    infoValue: {
        color: theme.colors.text,
        fontSize: "16px",
    },

    skills: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
    },

    skill: {
        background: "#eef2ff",
        color: "#3730a3",
        padding: "7px 12px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600",
    },

    actions: {
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
    },

    actionButton: {
        border: "none",
        background: theme.colors.primary,
        color: "#fff",
        padding: "11px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },

    button: {
        border: "none",
        background: theme.colors.primary,
        color: "#fff",
        padding: "11px 18px",
        borderRadius: "8px",
        cursor: "pointer",
    },

    empty: {
        padding: "60px",
        textAlign: "center",
    },
};

export default TeacherStudentDetails;