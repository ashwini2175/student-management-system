import { useState } from "react";
import theme from "../styles/theme";

function TeacherPlacement() {
    const [formData, setFormData] = useState({
        companyName: "",
        role: "",
        eligibilityCGPA: "",
        package: "",
        placementDate: "",
        placementTime: "",
        location: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setSuccess("");
        setError("");

        try {
            if (!token) {
                throw new Error("Please login again as a teacher.");
            }

            if (!formData.companyName.trim()) {
                throw new Error("Company name is required.");
            }

            if (!formData.role.trim()) {
                throw new Error("Job role is required.");
            }

            const cgpa = Number(formData.eligibilityCGPA);

            if (
                formData.eligibilityCGPA.trim() === "" ||
                !Number.isFinite(cgpa) ||
                cgpa < 0 ||
                cgpa > 10
            ) {
                throw new Error("Enter a valid CGPA between 0 and 10.");
            }

            if (!formData.package.trim()) {
                throw new Error("Package is required.");
            }

            if (!formData.placementDate) {
                throw new Error("Placement date is required.");
            }

            if (!formData.placementTime) {
                throw new Error("Placement time is required.");
            }

            if (!formData.location.trim()) {
                throw new Error("Location is required.");
            }

            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/placement",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        company: formData.companyName.trim(),
                        role: formData.role.trim(),
                        eligibilityCGPA: cgpa,
                        package: formData.package.trim(),
                        driveDate: formData.placementDate,
                        time: formData.placementTime,
                        location: formData.location.trim(),
                        description: formData.description.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create placement."
                );
            }

            setSuccess(
                `Placement created successfully. ${data.notificationsSent ?? 0
                } eligible student(s) notified.`
            );

            setFormData({
                companyName: "",
                role: "",
                eligibilityCGPA: "",
                package: "",
                placementDate: "",
                placementTime: "",
                location: "",
                description: "",
            });
        } catch (error) {
            setError(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1
                style={{
                    color: theme.colors.primary,
                }}
            >
                🏢 Placement Drive
            </h1>

            <p
                style={{
                    color: theme.colors.textSecondary,
                }}
            >
                Create a placement opportunity for
                eligible students.
            </p>

            {success && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "15px",
                        background: "#dcfce7",
                        color: "#166534",
                        borderRadius: "10px",
                    }}
                >
                    ✅ {success}
                </div>
            )}

            {error && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "15px",
                        background: "#fee2e2",
                        color: "#991b1b",
                        borderRadius: "10px",
                    }}
                >
                    ⚠️ {error}
                </div>
            )}

            <div
                style={{
                    maxWidth: "850px",
                    marginTop: "25px",
                    background: theme.colors.card,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: "15px",
                    padding: "30px",
                }}
            >
                <form onSubmit={handleSubmit}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "18px",
                        }}
                    >
                        <div>
                            <label>
                                <strong>
                                    Company Name
                                </strong>
                            </label>

                            <input
                                name="companyName"
                                value={
                                    formData.companyName
                                }
                                onChange={handleChange}
                                placeholder="e.g. TCS"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px",
                                    boxSizing:
                                        "border-box",
                                    borderRadius: "8px",
                                    border: `1px solid ${theme.colors.border}`,
                                }}
                            />
                        </div>

                        <div>
                            <label>
                                <strong>
                                    Job Role
                                </strong>
                            </label>

                            <input
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="e.g. Software Engineer"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px",
                                    boxSizing:
                                        "border-box",
                                    borderRadius: "8px",
                                    border: `1px solid ${theme.colors.border}`,
                                }}
                            />
                        </div>

                        <div>
                            <label>
                                <strong>
                                    Eligibility CGPA
                                </strong>
                            </label>

                            <input
                                type="number"
                                step="0.1"
                                name="eligibilityCGPA"
                                value={
                                    formData.eligibilityCGPA
                                }
                                onChange={handleChange}
                                placeholder="7.0"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px",
                                    boxSizing:
                                        "border-box",
                                    borderRadius: "8px",
                                    border: `1px solid ${theme.colors.border}`,
                                }}
                            />
                        </div>

                        <div>
                            <label>
                                <strong>
                                    Package
                                </strong>
                            </label>

                            <input
                                name="package"
                                value={
                                    formData.package
                                }
                                onChange={handleChange}
                                placeholder="e.g. 6 LPA"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px",
                                    boxSizing:
                                        "border-box",
                                    borderRadius: "8px",
                                    border: `1px solid ${theme.colors.border}`,
                                }}
                            />
                        </div>

                        <div>
                            <label>
                                <strong>
                                    driveDate
                                </strong>
                            </label>

                            <input
                                type="date"
                                name="placementDate"
                                value={
                                    formData.placementDate
                                }
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px",
                                    boxSizing:
                                        "border-box",
                                    borderRadius: "8px",
                                    border: `1px solid ${theme.colors.border}`,
                                }}
                            />
                        </div>

                        <div>
                            <label>
                                <strong>
                                    Placement Time
                                </strong>
                            </label>

                            <input
                                type="time"
                                name="placementTime"
                                value={
                                    formData.placementTime
                                }
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px",
                                    boxSizing:
                                        "border-box",
                                    borderRadius: "8px",
                                    border: `1px solid ${theme.colors.border}`,
                                }}
                            />
                        </div>

                        <div
                            style={{
                                gridColumn:
                                    "1 / -1",
                            }}
                        >
                            <label>
                                <strong>
                                    Location
                                </strong>
                            </label>

                            <input
                                name="location"
                                value={
                                    formData.location
                                }
                                onChange={handleChange}
                                placeholder="e.g. KIT College Campus"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px",
                                    boxSizing:
                                        "border-box",
                                    borderRadius: "8px",
                                    border: `1px solid ${theme.colors.border}`,
                                }}
                            />
                        </div>

                        <div
                            style={{
                                gridColumn:
                                    "1 / -1",
                            }}
                        >
                            <label>
                                <strong>
                                    Description
                                </strong>
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={handleChange}
                                rows="5"
                                placeholder="Enter placement drive details..."
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "8px",
                                    boxSizing:
                                        "border-box",
                                    borderRadius: "8px",
                                    border: `1px solid ${theme.colors.border}`,
                                    resize: "vertical",
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: "25px",
                            background:
                                theme.colors.primary,
                            color: "#fff",
                            border: "none",
                            padding: "13px 25px",
                            borderRadius: "8px",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                            fontWeight: "600",
                        }}
                    >
                        {loading
                            ? "Creating..."
                            : "🏢 Create Placement Drive"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default TeacherPlacement;