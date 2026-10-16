import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TeacherDashboard() {
    const navigate = useNavigate();

    const [teacher, setTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [placementDrives, setPlacementDrives] = useState([]);

    useEffect(() => {
        const savedTeacher = localStorage.getItem("teacher");

        if (savedTeacher) {
            setTeacher(JSON.parse(savedTeacher));
        }

        loadStudents();
        loadPlacementDrives();
    }, []);

    // ==============================
    // Load Students
    // ==============================
    const loadStudents = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/student",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load students");
            }

            const data = await response.json();

            setStudents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Students Error:", error);
        }
    };

    // ==============================
    // Load Placement Drives
    // ==============================
    const loadPlacementDrives = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/placement",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load placement drives");
            }

            const data = await response.json();

            setPlacementDrives(
                Array.isArray(data)
                    ? data
                    : data.placements || []
            );
        } catch (error) {
            console.error("Placement Error:", error);
        }
    };

    // ==============================
    // Logout
    // ==============================
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("teacher");

        navigate("/login");
    };

    // ==============================
    // Student Statistics
    // ==============================

    const totalStudents = students.length;

    const placementReady = students.filter(
        (student) =>
            student.placementStatus === "Placement Ready"
    ).length;

    const needsGuidance = students.filter(
        (student) =>
            student.placementStatus === "Needs Guidance"
    ).length;

    const immediateAttention = students.filter(
        (student) =>
            student.placementStatus === "Immediate Attention"
    ).length;

    return (
        <div style={styles.page}>

            {/* ================= HEADER ================= */}

            <div style={styles.header}>

                <div>
                    <h1 style={styles.title}>
                        👨‍🏫 Teacher Dashboard
                    </h1>

                    <p style={styles.welcome}>
                        Welcome back,{" "}
                        <strong>
                            {teacher?.name || "Teacher"}
                        </strong>
                    </p>

                    <div style={styles.teacherInfo}>
                        <span>
                            🏫 {teacher?.department || "Department"}
                        </span>

                        <span>
                            💼{" "}
                            {teacher?.designation ||
                                "Teacher"}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    style={styles.logoutButton}
                >
                    Logout
                </button>

            </div>

            {/* ================= STATISTICS ================= */}

            <div style={styles.statsGrid}>

                <StatCard
                    icon="👨‍🎓"
                    value={totalStudents}
                    title="Total Students"
                    subtitle="Registered students"
                />

                <StatCard
                    icon="🟢"
                    value={placementReady}
                    title="Placement Ready"
                    subtitle="Ready for placement"
                />

                <StatCard
                    icon="🟠"
                    value={needsGuidance}
                    title="Needs Guidance"
                    subtitle="Students requiring support"
                />

                <StatCard
                    icon="🔴"
                    value={immediateAttention}
                    title="Immediate Attention"
                    subtitle="Students needing attention"
                />

            </div>

            {/* ================= QUICK ACTIONS ================= */}

            <section>

                <h2 style={styles.sectionTitle}>
                    Quick Actions
                </h2>

                =<div style={styles.actionGrid}>

                    <ActionCard
                        icon="👨‍🎓"
                        title="Students"
                        description="View and manage student records"
                        onClick={() =>
                            navigate("/teacher/students")
                        }
                    />

                    <ActionCard
                        icon="🔍"
                        title="Search Students"
                        description="Search students by PRN or CGPA"
                        onClick={() =>
                            navigate("/teacher/students")
                        }
                    />

                    <ActionCard
                        icon="🧭"
                        title="Career Guidance"
                        description="View students who need guidance"
                        onClick={() =>
                            navigate("/teacher/guidance")
                        }
                    />

                    <ActionCard
                        icon="📢"
                        title="Placement Drives"
                        description="Create and manage placement opportunities"
                        onClick={() =>
                            navigate("/teacher/placement")
                        }
                    />

                </div>

            </section>

            {/* ================= RECENT PLACEMENTS ================= */}

            <section style={styles.placementSection}>

                <div style={styles.sectionHeader}>

                    <h2 style={styles.sectionTitle}>
                        Recent Placement Drives
                    </h2>

                    <button
                        onClick={() =>
                            navigate("/teacher/placement")
                        }
                        style={styles.viewButton}
                    >
                        Manage Drives →
                    </button>

                </div>

                {placementDrives.length === 0 ? (

                    <div style={styles.emptyCard}>
                        <div style={styles.emptyIcon}>
                            📢
                        </div>

                        <h3>No Placement Drives Yet</h3>

                        <p>
                            Create a placement drive to
                            notify eligible students.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/teacher/placement")
                            }
                            style={styles.primaryButton}
                        >
                            Create Placement Drive
                        </button>
                    </div>

                ) : (

                    <div style={styles.placementList}>

                        {placementDrives
                            .slice(0, 3)
                            .map((drive) => (

                                <div
                                    key={drive._id}
                                    style={styles.placementCard}
                                >

                                    <div>
                                        <h3>
                                            {drive.companyName}
                                        </h3>

                                        <p>
                                            {drive.role}
                                        </p>
                                    </div>

                                    <div style={styles.driveDetails}>

                                        <span>
                                            🎓 CGPA{" "}
                                            {drive.eligibilityCGPA}+
                                        </span>

                                        <span>
                                            💰{" "}
                                            {drive.package ||
                                                "Package not specified"}
                                        </span>

                                        <span>
                                            📍{" "}
                                            {drive.location ||
                                                "Location not specified"}
                                        </span>

                                    </div>

                                </div>

                            ))}

                    </div>
                )}

            </section>

        </div>
    );
}


/* ==========================================
   STAT CARD
========================================== */

function StatCard({
    icon,
    value,
    title,
    subtitle,
}) {
    return (
        <div style={styles.statCard}>

            <div style={styles.statIcon}>
                {icon}
            </div>

            <div>
                <div style={styles.statValue}>
                    {value}
                </div>

                <div style={styles.statTitle}>
                    {title}
                </div>

                <div style={styles.statSubtitle}>
                    {subtitle}
                </div>
            </div>

        </div>
    );
}


/* ==========================================
   ACTION CARD
========================================== */

function ActionCard({
    icon,
    title,
    description,
    onClick,
}) {
    return (
        <div
            style={styles.actionCard}
            onClick={onClick}
        >

            <div style={styles.actionIcon}>
                {icon}
            </div>

            <div>

                <h3 style={styles.actionTitle}>
                    {title}
                </h3>

                <p style={styles.actionDescription}>
                    {description}
                </p>

                <span style={styles.actionLink}>
                    Open →
                </span>

            </div>

        </div>
    );
}


/* ==========================================
   STYLES
========================================== */

const styles = {

    page: {
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "35px 45px",
        boxSizing: "border-box",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "35px",
    },

    title: {
        margin: 0,
        fontSize: "32px",
        color: "#1f2937",
    },

    welcome: {
        marginTop: "10px",
        marginBottom: "8px",
        color: "#4b5563",
        fontSize: "17px",
    },

    teacherInfo: {
        display: "flex",
        gap: "20px",
        color: "#6b7280",
        fontSize: "14px",
    },

    logoutButton: {
        border: "none",
        background: "#dc2626",
        color: "white",
        padding: "11px 22px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },

    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        marginBottom: "40px",
    },

    statCard: {
        background: "white",
        borderRadius: "14px",
        padding: "22px",
        display: "flex",
        alignItems: "center",
        gap: "18px",
        boxShadow:
            "0 5px 18px rgba(0,0,0,0.07)",
    },

    statIcon: {
        width: "55px",
        height: "55px",
        borderRadius: "12px",
        background: "#eef2ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "26px",
    },

    statValue: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#111827",
    },

    statTitle: {
        fontSize: "15px",
        fontWeight: "600",
        color: "#374151",
    },

    statSubtitle: {
        marginTop: "3px",
        fontSize: "12px",
        color: "#9ca3af",
    },

    sectionTitle: {
        fontSize: "22px",
        color: "#1f2937",
        marginBottom: "20px",
    },

    actionGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
    },

    actionCard: {
        background: "white",
        borderRadius: "14px",
        padding: "24px",
        display: "flex",
        gap: "18px",
        cursor: "pointer",
        boxShadow:
            "0 5px 18px rgba(0,0,0,0.07)",
        transition: "transform 0.2s",
    },

    actionIcon: {
        fontSize: "30px",
        width: "50px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
        borderRadius: "12px",
    },

    actionTitle: {
        margin: "0 0 7px",
        fontSize: "18px",
    },

    actionDescription: {
        margin: 0,
        color: "#6b7280",
        fontSize: "14px",
        lineHeight: "1.5",
    },

    actionLink: {
        display: "inline-block",
        marginTop: "12px",
        color: "#2563eb",
        fontSize: "13px",
        fontWeight: "600",
    },

    placementSection: {
        marginTop: "45px",
    },

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    viewButton: {
        border: "none",
        background: "transparent",
        color: "#2563eb",
        fontWeight: "600",
        cursor: "pointer",
    },

    emptyCard: {
        background: "white",
        borderRadius: "14px",
        padding: "45px",
        textAlign: "center",
        boxShadow:
            "0 5px 18px rgba(0,0,0,0.07)",
    },

    emptyIcon: {
        fontSize: "40px",
    },

    primaryButton: {
        marginTop: "15px",
        border: "none",
        background: "#2563eb",
        color: "white",
        padding: "11px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },

    placementList: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },

    placementCard: {
        background: "white",
        borderRadius: "14px",
        padding: "22px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow:
            "0 5px 18px rgba(0,0,0,0.07)",
    },

    driveDetails: {
        display: "flex",
        gap: "20px",
        color: "#6b7280",
        fontSize: "13px",
    },
};

export default TeacherDashboard;