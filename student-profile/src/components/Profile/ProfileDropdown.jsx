import { useNavigate } from "react-router-dom";
import theme from "../../styles/theme";

function ProfileDropdown() {
    const navigate = useNavigate();

    const savedStudent = localStorage.getItem("student");

    let student = null;

    try {
        student = savedStudent
            ? JSON.parse(savedStudent)
            : null;
    } catch (error) {
        console.error("Invalid student data:", error);
    }

    // =========================================
    // LOGOUT
    // =========================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("student");

        navigate("/student-login");
    };

    // =========================================
    // PROFILE
    // =========================================

    const handleProfile = () => {
        navigate("/profile");
    };

    // =========================================
    // SETTINGS
    // =========================================

    const handleSettings = () => {
        navigate("/settings");
    };

    return (
        <div
            style={{
                position: "absolute",
                right: 0,
                top: "55px",
                width: "240px",
                background: theme.colors.card,
                borderRadius: "12px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                padding: "20px",
                zIndex: 1000,
            }}
        >
            {/* =========================================
                STUDENT INFORMATION
            ========================================= */}

            <h3
                style={{
                    margin: 0,
                    color: theme.colors.text,
                }}
            >
                {student?.name || "Student"}
            </h3>

            <p
                style={{
                    color: theme.colors.textSecondary,
                    marginTop: "8px",
                    marginBottom: "5px",
                }}
            >
                {student?.year
                    ? student.year === 4
                        ? "Final Year Student"
                        : `Year ${student.year} Student`
                    : "Student"}
            </p>

            <p
                style={{
                    color: theme.colors.textSecondary,
                    marginTop: "5px",
                    marginBottom: 0,
                }}
            >
                {student?.department || "Department"}
            </p>

            <hr
                style={{
                    border: "none",
                    borderTop: `1px solid ${theme.colors.border}`,
                    margin: "15px 0",
                }}
            />

            {/* =========================================
                MY PROFILE
            ========================================= */}

            <p
                onClick={handleProfile}
                style={{
                    cursor: "pointer",
                    color: theme.colors.text,
                    padding: "8px 0",
                    margin: 0,
                }}
            >
                👤 My Profile
            </p>

            {/* =========================================
                SETTINGS
            ========================================= */}

            <p
                onClick={handleSettings}
                style={{
                    cursor: "pointer",
                    color: theme.colors.text,
                    padding: "8px 0",
                    margin: 0,
                }}
            >
                ⚙️ Settings
            </p>

            {/* =========================================
                LOGOUT
            ========================================= */}

            <p
                onClick={handleLogout}
                style={{
                    cursor: "pointer",
                    color: "#dc2626",
                    fontWeight: "600",
                    padding: "8px 0",
                    margin: 0,
                }}
            >
                🚪 Logout
            </p>
        </div>
    );
}

export default ProfileDropdown;