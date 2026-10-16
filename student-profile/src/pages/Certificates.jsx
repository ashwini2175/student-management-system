import { useEffect, useState } from "react";
import theme from "../styles/theme";

function Certificates() {
    const [certificates, setCertificates] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        issuer: "",
        year: "",
        certificate: null,
    });

    const token = localStorage.getItem("token");

    // =========================================
    // FETCH CERTIFICATES
    // =========================================

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            setError("");

            if (!token) {
                throw new Error(
                    "Login token not found. Please login again."
                );
            }

            const response = await fetch(
                "http://localhost:5000/student/certificates",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to fetch certificates"
                );
            }

            setCertificates(data.certificates || []);

        } catch (error) {
            console.error(
                "Certificate Error:",
                error
            );

            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    // =========================================
    // INPUT CHANGE
    // =========================================

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    // =========================================
    // ADD CERTIFICATE
    // =========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");

            if (!formData.title.trim()) {
                throw new Error(
                    "Please enter certificate name."
                );
            }

            if (!formData.issuer.trim()) {
                throw new Error(
                    "Please enter certificate issuer."
                );
            }

            if (!formData.year) {
                throw new Error(
                    "Please enter certificate year."
                );
            }

            if (!formData.certificate) {
                throw new Error(
                    "Please select a certificate PDF."
                );
            }

            if (
                formData.certificate.type !==
                "application/pdf"
            ) {
                throw new Error(
                    "Only PDF certificates are allowed."
                );
            }

            const data = new FormData();

            data.append("title", formData.title);
            data.append("issuer", formData.issuer);
            data.append("year", formData.year);
            data.append(
                "certificate",
                formData.certificate
            );

            const response = await fetch(
                "http://localhost:5000/student/certificates",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: data,
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to upload certificate"
                );
            }

            // Add new certificate immediately
            setCertificates((prev) => [
                ...prev,
                result.certificate,
            ]);

            // Reset form
            setFormData({
                title: "",
                issuer: "",
                year: "",
                certificate: null,
            });

            setShowForm(false);

        } catch (error) {
            console.error(
                "Upload Certificate Error:",
                error
            );

            setError(error.message);
        }
    };

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div>
                <h1
                    style={{
                        color: theme.colors.primary,
                    }}
                >
                    🏆 My Certificates
                </h1>

                <p
                    style={{
                        color:
                            theme.colors.textSecondary,
                    }}
                >
                    Loading certificates...
                </p>
            </div>
        );
    }

    // =========================================
    // PAGE
    // =========================================

    return (
        <div>

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px",
                }}
            >
                <div>
                    <h1
                        style={{
                            color:
                                theme.colors.primary,
                            marginBottom: "8px",
                        }}
                    >
                        🏆 My Certificates
                    </h1>

                    <p
                        style={{
                            color:
                                theme.colors.textSecondary,
                        }}
                    >
                        Upload and manage your
                        professional certifications.
                    </p>
                </div>

                <button
                    onClick={() =>
                        setShowForm(!showForm)
                    }
                    style={{
                        background:
                            theme.colors.primary,
                        color: "#fff",
                        border: "none",
                        padding: "12px 20px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                >
                    {showForm
                        ? "✕ Cancel"
                        : "+ Add Certificate"}
                </button>
            </div>

            {/* ERROR */}

            {error && (
                <div
                    style={{
                        background: "#fee2e2",
                        color: "#991b1b",
                        padding: "15px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                    }}
                >
                    ⚠️ {error}
                </div>
            )}

            {/* ADD CERTIFICATE FORM */}

            {showForm && (
                <div
                    style={{
                        background:
                            theme.colors.card,
                        border:
                            `1px solid ${theme.colors.border}`,
                        borderRadius: "15px",
                        padding: "25px",
                        marginBottom: "30px",
                    }}
                >
                    <h2
                        style={{
                            color:
                                theme.colors.text,
                            marginTop: 0,
                        }}
                    >
                        📄 Upload Certificate
                    </h2>

                    <form onSubmit={handleSubmit}>

                        {/* TITLE */}

                        <div style={{ marginBottom: "15px" }}>
                            <label>
                                <strong>
                                    Certificate Name
                                </strong>
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. React Development Certification"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "7px",
                                    borderRadius: "8px",
                                    border:
                                        `1px solid ${theme.colors.border}`,
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* ISSUER */}

                        <div style={{ marginBottom: "15px" }}>
                            <label>
                                <strong>
                                    Issued By
                                </strong>
                            </label>

                            <input
                                type="text"
                                name="issuer"
                                value={formData.issuer}
                                onChange={handleChange}
                                placeholder="e.g. Udemy, AWS, Coursera"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "7px",
                                    borderRadius: "8px",
                                    border:
                                        `1px solid ${theme.colors.border}`,
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* YEAR */}

                        <div style={{ marginBottom: "15px" }}>
                            <label>
                                <strong>
                                    Year
                                </strong>
                            </label>

                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                placeholder="2026"
                                min="2000"
                                max="2100"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "7px",
                                    borderRadius: "8px",
                                    border:
                                        `1px solid ${theme.colors.border}`,
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* PDF */}

                        <div style={{ marginBottom: "20px" }}>
                            <label>
                                <strong>
                                    Certificate PDF
                                </strong>
                            </label>

                            <input
                                type="file"
                                name="certificate"
                                accept="application/pdf,.pdf"
                                onChange={handleChange}
                                style={{
                                    display: "block",
                                    marginTop: "10px",
                                }}
                            />

                            <small
                                style={{
                                    color:
                                        theme.colors.textSecondary,
                                }}
                            >
                                Only PDF files are allowed.
                            </small>
                        </div>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            style={{
                                background:
                                    theme.colors.primary,
                                color: "#fff",
                                border: "none",
                                padding:
                                    "12px 25px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "600",
                            }}
                        >
                            📤 Upload Certificate
                        </button>

                    </form>
                </div>
            )}

            {/* CERTIFICATE LIST */}

            {certificates.length === 0 ? (

                <div
                    style={{
                        background:
                            theme.colors.card,
                        border:
                            `1px solid ${theme.colors.border}`,
                        borderRadius: "15px",
                        padding: "50px",
                        textAlign: "center",
                    }}
                >
                    <div style={{ fontSize: "50px" }}>
                        🏆
                    </div>

                    <h2
                        style={{
                            color:
                                theme.colors.text,
                        }}
                    >
                        No Certificates Yet
                    </h2>

                    <p
                        style={{
                            color:
                                theme.colors.textSecondary,
                        }}
                    >
                        Upload your certificates to
                        showcase your achievements.
                    </p>
                </div>

            ) : (

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {certificates.map(
                        (certificate) => (

                            <div
                                key={certificate._id}
                                style={{
                                    background:
                                        theme.colors.card,
                                    border:
                                        `1px solid ${theme.colors.border}`,
                                    borderRadius:
                                        "15px",
                                    padding: "25px",
                                }}
                            >

                                <div
                                    style={{
                                        fontSize:
                                            "40px",
                                        marginBottom:
                                            "15px",
                                    }}
                                >
                                    🏆
                                </div>

                                <h2
                                    style={{
                                        color:
                                            theme.colors.text,
                                    }}
                                >
                                    {certificate.title}
                                </h2>

                                <p
                                    style={{
                                        color:
                                            theme.colors.textSecondary,
                                    }}
                                >
                                    <strong>
                                        Issued by:
                                    </strong>{" "}
                                    {certificate.issuer}
                                </p>

                                <p
                                    style={{
                                        color:
                                            theme.colors.textSecondary,
                                    }}
                                >
                                    <strong>
                                        Year:
                                    </strong>{" "}
                                    {certificate.year}
                                </p>

                                {certificate.fileUrl && (
                                    <a
                                        href={`http://localhost:5000${certificate.fileUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: "inline-block",
                                            marginTop: "15px",
                                            color: theme.colors.primary,
                                            fontWeight: "600",
                                            textDecoration: "none",
                                        }}
                                    >
                                        📄 View Certificate →
                                    </a>
                                )}

                            </div>
                        )
                    )}
                </div>
            )}

        </div>
    );
}

export default Certificates;