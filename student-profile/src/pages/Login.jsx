import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f7fb",
            }}
        >
            <div
                style={{
                    width: "420px",
                    background: "white",
                    padding: "40px",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    textAlign: "center",
                }}
            >
                <h1>Student Management System</h1>

                <p style={{ color: "#666", marginBottom: "30px" }}>
                    Choose how you want to login
                </p>

                <button
                    onClick={() => navigate("/student-login")}
                    style={{
                        width: "100%",
                        padding: "14px",
                        marginBottom: "15px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#2563eb",
                        color: "white",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    🎓 Login as Student
                </button>

                <button
                    onClick={() => navigate("/teacher-login")}
                    style={{
                        width: "100%",
                        padding: "14px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#16a34a",
                        color: "white",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    👨‍🏫 Login as Teacher
                </button>
            </div>
        </div>
    );
}

export default Login;