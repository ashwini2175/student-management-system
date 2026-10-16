import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TeacherLogin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        employeeId: "",
        department: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(
                "http://localhost:5000/teacher/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        employeeId: formData.employeeId,
                        department: formData.department,
                        password: formData.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Teacher login failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", "Teacher");
            localStorage.setItem("teacher", JSON.stringify(data.teacher));

            navigate("/teacher/dashboard");
        } catch (error) {
            console.error("Teacher Login Error:", error);
            setError(error.message);
        }
    };

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
            <form
                onSubmit={handleSubmit}
                style={{
                    width: "420px",
                    background: "white",
                    padding: "35px",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
            >
                <h2>👨‍🏫 Teacher Login</h2>

                <p style={{ color: "#666" }}>
                    Login using your teacher credentials
                </p>

                {error && (
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#b91c1c",
                            padding: "10px",
                            borderRadius: "8px",
                            marginBottom: "15px",
                        }}
                    >
                        {error}
                    </div>
                )}

                <label>Employee ID</label>

                <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="Enter employee ID"
                    required
                    style={inputStyle}
                />

                <label>Department</label>

                <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science & Engineering"
                    required
                    style={inputStyle}
                />

                <label>Password</label>

                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    style={inputStyle}
                />

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "13px",
                        marginTop: "20px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#16a34a",
                        color: "white",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    Login
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/")}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        background: "white",
                        cursor: "pointer",
                    }}
                >
                    ← Back
                </button>
            </form>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "6px",
    marginBottom: "18px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box",
};

export default TeacherLogin;