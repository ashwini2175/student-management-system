import { useState } from "react";
import theme from "../styles/theme";

function TeacherGuidance() {
    const [studentPRN, setStudentPRN] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [category, setCategory] = useState("Career");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setSuccess("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please login again as a teacher.");
            }

            if (!studentPRN.trim()) {
                throw new Error("Please enter student PRN.");
            }

            if (!title.trim()) {
                throw new Error("Please enter guidance title.");
            }

            if (!message.trim()) {
                throw new Error("Please enter guidance message.");
            }

            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/guidance",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        studentPRN: studentPRN.trim(),
                        title: title.trim(),
                        message: message.trim(),
                        category,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to send guidance."
                );
            }

            setSuccess("Guidance sent successfully.");
            setStudentPRN("");
            setTitle("");
            setMessage("");
            setCategory("Career");
        } catch (error) {
            setError(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 style={{ color: theme.colors.primary }}>
                💬 Student Guidance
            </h1>

            <p style={{ color: theme.colors.textSecondary }}>
                Send guidance and requirements to students.
            </p>

            {success && (
                <div
                    role="status"
                    style={{
                        ...noticeStyle,
                        background: "#dcfce7",
                        color: "#166534",
                    }}
                >
                    ✅ {success}
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    style={{
                        ...noticeStyle,
                        background: "#fee2e2",
                        color: "#991b1b",
                    }}
                >
                    ⚠️ {error}
                </div>
            )}

            <div
                style={{
                    maxWidth: "750px",
                    marginTop: "25px",
                    background: theme.colors.card,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: "15px",
                    padding: "30px",
                }}
            >
                <form onSubmit={handleSubmit}>
                    <div style={fieldStyle}>
                        <label htmlFor="studentPRN">
                            <strong>Student PRN</strong>
                        </label>

                        <input
                            id="studentPRN"
                            type="text"
                            value={studentPRN}
                            onChange={(e) =>
                                setStudentPRN(e.target.value)
                            }
                            placeholder="Enter student PRN"
                            required
                            disabled={loading}
                            style={inputStyle}
                        />
                    </div>

                    <div style={fieldStyle}>
                        <label htmlFor="guidanceTitle">
                            <strong>Guidance Title</strong>
                        </label>

                        <input
                            id="guidanceTitle"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Improve DSA preparation"
                            required
                            disabled={loading}
                            style={inputStyle}
                        />
                    </div>

                    <div style={fieldStyle}>
                        <label htmlFor="guidanceCategory">
                            <strong>Category</strong>
                        </label>

                        <select
                            id="guidanceCategory"
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                            disabled={loading}
                            style={inputStyle}
                        >
                            <option value="Career">Career</option>
                            <option value="Academic">Academic</option>
                            <option value="Placement">Placement</option>
                            <option value="Project">Project</option>
                        </select>
                    </div>

                    <div style={fieldStyle}>
                        <label htmlFor="guidanceMessage">
                            <strong>Message</strong>
                        </label>

                        <textarea
                            id="guidanceMessage"
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            placeholder="Enter guidance message..."
                            rows={6}
                            required
                            disabled={loading}
                            style={{
                                ...inputStyle,
                                resize: "vertical",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: theme.colors.primary,
                            color: "#fff",
                            border: "none",
                            padding: "12px 22px",
                            borderRadius: "8px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontWeight: "600",
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? "Sending..." : "📨 Send Guidance"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const fieldStyle = {
    marginBottom: "18px",
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    boxSizing: "border-box",
    borderRadius: "8px",
    border: `1px solid ${theme.colors.border}`,
    font: "inherit",
};

const noticeStyle = {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "10px",
};

export default TeacherGuidance;