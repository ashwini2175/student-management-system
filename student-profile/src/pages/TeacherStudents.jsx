import { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../styles/theme";

function TeacherStudents() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    // =========================================
    // TEMPORARY FRONTEND DATA
    // =========================================

    const students = [
        {
            id: 1,
            name: "Rohit Vasave",
            prn: "2324000845",
            department: "Computer Science & Engineering",
            year: 4,
            cgpa: 8.75,
            placementScore: 82,
            placementStatus: "Placement Ready",
            skills: [
                "HTML",
                "CSS",
                "JavaScript",
                "React",
                "Git",
            ],
        },

        {
            id: 2,
            name: "Priya Patil",
            prn: "2324000821",
            department: "Computer Science & Engineering",
            year: 4,
            cgpa: 8.2,
            placementScore: 74,
            placementStatus: "Needs Guidance",
            skills: [
                "Java",
                "SQL",
                "Python",
                "Git",
            ],
        },

        {
            id: 3,
            name: "Rahul Jadhav",
            prn: "2324000798",
            department: "Information Technology",
            year: 4,
            cgpa: 7.4,
            placementScore: 48,
            placementStatus: "Immediate Attention",
            skills: [
                "HTML",
                "CSS",
                "JavaScript",
            ],
        },

        {
            id: 4,
            name: "Sakshi Shinde",
            prn: "2324000872",
            department: "Computer Science & Engineering",
            year: 3,
            cgpa: 9.1,
            placementScore: 91,
            placementStatus: "Placement Ready",
            skills: [
                "React",
                "Node.js",
                "MongoDB",
                "Python",
            ],
        },
    ];

    // =========================================
    // SEARCH
    // =========================================

    const filteredStudents = students.filter((student) => {
        const value = search.toLowerCase().trim();

        if (!value) {
            return true;
        }

        return (
            student.name
                .toLowerCase()
                .includes(value) ||
            student.prn
                .toLowerCase()
                .includes(value)
        );
    });

    // =========================================
    // STATUS STYLE
    // =========================================

    const getStatusStyle = (status) => {
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
    };

    // =========================================
    // PAGE
    // =========================================

    return (
        <div>

            {/* HEADER */}

            <div style={styles.header}>

                <div>

                    <h1 style={styles.title}>
                        👨‍🎓 Students
                    </h1>

                    <p style={styles.subtitle}>
                        Search and monitor student
                        academic and placement
                        information.
                    </p>

                </div>

                <div style={styles.studentCount}>

                    <strong>
                        {filteredStudents.length}
                    </strong>

                    <span>
                        Students
                    </span>

                </div>

            </div>

            {/* SEARCH */}

            <div style={styles.searchCard}>

                <div style={styles.searchWrapper}>

                    <span style={styles.searchIcon}>
                        🔍
                    </span>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search by student name or PRN..."
                        style={styles.searchInput}
                    />

                    {search && (
                        <button
                            onClick={() =>
                                setSearch("")
                            }
                            style={styles.clearButton}
                        >
                            ✕
                        </button>
                    )}

                </div>

            </div>

            {/* STUDENT LIST */}

            {filteredStudents.length === 0 ? (

                <div style={styles.emptyState}>

                    <div style={styles.emptyIcon}>
                        🔍
                    </div>

                    <h2 style={styles.emptyTitle}>
                        No Students Found
                    </h2>

                    <p style={styles.emptyText}>
                        Try searching with another
                        student name or PRN.
                    </p>

                </div>

            ) : (

                <div style={styles.grid}>

                    {filteredStudents.map(
                        (student) => (

                            <div
                                key={student.id}
                                style={
                                    styles.studentCard
                                }
                            >

                                {/* CARD HEADER */}

                                <div
                                    style={
                                        styles.cardHeader
                                    }
                                >

                                    <div
                                        style={
                                            styles.avatar
                                        }
                                    >
                                        {student.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div
                                        style={
                                            styles.studentIdentity
                                        }
                                    >

                                        <h2
                                            style={
                                                styles.studentName
                                            }
                                        >
                                            {student.name}
                                        </h2>

                                        <p
                                            style={
                                                styles.prn
                                            }
                                        >
                                            PRN:{" "}
                                            {student.prn}
                                        </p>

                                    </div>

                                </div>

                                {/* STATUS */}

                                <div
                                    style={{
                                        ...styles.statusBadge,
                                        ...getStatusStyle(
                                            student.placementStatus
                                        ),
                                    }}
                                >
                                    {
                                        student.placementStatus
                                    }
                                </div>

                                {/* BASIC INFO */}

                                <div
                                    style={
                                        styles.infoGrid
                                    }
                                >

                                    <div>

                                        <span
                                            style={
                                                styles.label
                                            }
                                        >
                                            Department
                                        </span>

                                        <strong
                                            style={
                                                styles.value
                                            }
                                        >
                                            {
                                                student.department
                                            }
                                        </strong>

                                    </div>

                                    <div>

                                        <span
                                            style={
                                                styles.label
                                            }
                                        >
                                            Year
                                        </span>

                                        <strong
                                            style={
                                                styles.value
                                            }
                                        >
                                            {student.year ===
                                                4
                                                ? "Final Year"
                                                : `Year ${student.year}`}
                                        </strong>

                                    </div>

                                </div>

                                {/* PERFORMANCE */}

                                <div
                                    style={
                                        styles.performanceSection
                                    }
                                >

                                    <div
                                        style={
                                            styles.metric
                                        }
                                    >

                                        <span
                                            style={
                                                styles.label
                                            }
                                        >
                                            CGPA
                                        </span>

                                        <strong
                                            style={
                                                styles.metricValue
                                            }
                                        >
                                            {student.cgpa}
                                        </strong>

                                    </div>

                                    <div
                                        style={
                                            styles.metric
                                        }
                                    >

                                        <span
                                            style={
                                                styles.label
                                            }
                                        >
                                            Placement Score
                                        </span>

                                        <strong
                                            style={
                                                styles.metricValue
                                            }
                                        >
                                            {
                                                student.placementScore
                                            }
                                        </strong>

                                    </div>

                                </div>

                                {/* SKILLS */}

                                <div
                                    style={
                                        styles.skillsSection
                                    }
                                >

                                    <span
                                        style={
                                            styles.label
                                        }
                                    >
                                        Skills
                                    </span>

                                    <div
                                        style={
                                            styles.skills
                                        }
                                    >

                                        {student.skills.map(
                                            (
                                                skill,
                                                index
                                            ) => (

                                                <span
                                                    key={
                                                        index
                                                    }
                                                    style={
                                                        styles.skill
                                                    }
                                                >
                                                    {
                                                        skill
                                                    }
                                                </span>

                                            )
                                        )}

                                    </div>

                                </div>

                                {/* VIEW STUDENT */}

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/teacher/student/${student.id}`,
                                            {
                                                state: {
                                                    student,
                                                },
                                            }
                                        )
                                    }
                                    style={
                                        styles.viewButton
                                    }
                                >
                                    👁 View Student
                                </button>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}


// =========================================
// STYLES
// =========================================

const styles = {

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "25px",
    },

    title: {
        margin: 0,
        color: theme.colors.text,
        fontSize: "32px",
    },

    subtitle: {
        marginTop: "8px",
        color: theme.colors.textSecondary,
    },

    studentCount: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "90px",
        padding: "15px 20px",
        borderRadius: "12px",
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        color: theme.colors.text,
    },

    searchCard: {
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "15px",
        padding: "18px",
        marginBottom: "25px",
    },

    searchWrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },

    searchIcon: {
        position: "absolute",
        left: "15px",
        fontSize: "18px",
    },

    searchInput: {
        width: "100%",
        boxSizing: "border-box",
        padding: "13px 45px",
        borderRadius: "9px",
        border: `1px solid ${theme.colors.border}`,
        outline: "none",
        fontSize: "15px",
        background: "white",
    },

    clearButton: {
        position: "absolute",
        right: "12px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: "16px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
    },

    studentCard: {
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "16px",
        padding: "22px",
    },

    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
    },

    avatar: {
        width: "55px",
        height: "55px",
        borderRadius: "50%",
        background: theme.colors.primary,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "23px",
        fontWeight: "700",
        flexShrink: 0,
    },

    studentIdentity: {
        minWidth: 0,
    },

    studentName: {
        margin: 0,
        color: theme.colors.text,
        fontSize: "20px",
    },

    prn: {
        margin: "5px 0 0",
        color: theme.colors.textSecondary,
        fontSize: "13px",
    },

    statusBadge: {
        display: "inline-block",
        marginTop: "18px",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px",
        marginTop: "20px",
    },

    label: {
        display: "block",
        color: theme.colors.textSecondary,
        fontSize: "12px",
        marginBottom: "5px",
    },

    value: {
        display: "block",
        color: theme.colors.text,
        fontSize: "14px",
        lineHeight: "1.4",
    },

    performanceSection: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px",
        marginTop: "20px",
        paddingTop: "18px",
        borderTop: `1px solid ${theme.colors.border}`,
    },

    metric: {
        display: "flex",
        flexDirection: "column",
    },

    metricValue: {
        color: theme.colors.primary,
        fontSize: "22px",
    },

    skillsSection: {
        marginTop: "20px",
    },

    skills: {
        display: "flex",
        flexWrap: "wrap",
        gap: "7px",
        marginTop: "8px",
    },

    skill: {
        background: "#eef2ff",
        color: "#3730a3",
        padding: "5px 9px",
        borderRadius: "15px",
        fontSize: "11px",
        fontWeight: "600",
    },

    viewButton: {
        width: "100%",
        marginTop: "20px",
        padding: "11px",
        border: "none",
        borderRadius: "8px",
        background: theme.colors.primary,
        color: "#fff",
        cursor: "pointer",
        fontWeight: "600",
    },

    emptyState: {
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "16px",
        padding: "60px 30px",
        textAlign: "center",
    },

    emptyIcon: {
        fontSize: "45px",
    },

    emptyTitle: {
        color: theme.colors.text,
    },

    emptyText: {
        color: theme.colors.textSecondary,
    },
};

export default TeacherStudents;