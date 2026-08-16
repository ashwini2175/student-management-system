import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../styles/theme";

function StudentLogin() {
    const navigate = useNavigate();

    const [prn, setPrn] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/student/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prn,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Invalid PRN or Password"
                );
            }

            // Save JWT token
            localStorage.setItem("token", data.token);

            // Save student information
            localStorage.setItem(
                "student",
                JSON.stringify(data.student)
            );

            console.log("Student Login Successful");
            console.log("Token:", data.token);

            navigate("/dashboard");

        } catch (error) {
            console.error("Login Error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: theme.colors.background,
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    background: theme.colors.card,
                    padding: "35px",
                    borderRadius: "20px",
                    border: `1px solid ${theme.colors.border}`,
                    boxShadow: theme.colors.shadow,
                }}
            >
                <h1
                    style={{
                        color: theme.colors.primary,
                        textAlign: "center",
                        marginBottom: "10px",
                    }}
                >
                    🎓 Student Login
                </h1>

                <p
                    style={{
                        color: theme.colors.textSecondary,
                        textAlign: "center",
                        marginBottom: "30px",
                    }}
                >
                    Login using your PRN and password
                </p>

                {error && (
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#b91c1c",
                            padding: "12px",
                            borderRadius: "10px",
                            marginBottom: "20px",
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>

                    <label
                        style={{
                            display: "block",
                            color: theme.colors.text,
                            marginBottom: "8px",
                            fontWeight: "600",
                        }}
                    >
                        PRN
                    </label>

                    <input
                        type="text"
                        value={prn}
                        onChange={(e) => setPrn(e.target.value)}
                        placeholder="Enter your PRN"
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "20px",
                            borderRadius: "10px",
                            border: `1px solid ${theme.colors.border}`,
                            boxSizing: "border-box",
                        }}
                    />

                    <label
                        style={{
                            display: "block",
                            color: theme.colors.text,
                            marginBottom: "8px",
                            fontWeight: "600",
                        }}
                    >
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "25px",
                            borderRadius: "10px",
                            border: `1px solid ${theme.colors.border}`,
                            boxSizing: "border-box",
                        }}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "13px",
                            border: "none",
                            borderRadius: "10px",
                            background: theme.colors.primary,
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                        }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default StudentLogin;