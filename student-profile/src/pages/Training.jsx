import React, { useEffect, useState } from "react";
import "../styles/Training.css";
import theme from "../styles/theme";

function Training() {
    const [materials, setMaterials] = useState([]);
    const [year, setYear] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTraining = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Student login token not found.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/training/my",
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
                        data.message || "Failed to load training materials"
                    );
                }

                setYear(data.year);
                setMaterials(data.materials || []);

            } catch (error) {
                console.error("Training Error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTraining();
    }, []);

    const getYearLabel = (year) => {
        const yearLabels = {
            1: "FY",
            2: "SY",
            3: "TY",
            4: "B.Tech / Final Year",
        };

        return yearLabels[year] || "Unknown Year";
    };

    if (loading) {
        return (
            <div className="training-page">
                <h2 style={{ color: theme.colors.primary }}>
                    Loading training...
                </h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="training-page">
                <h2 style={{ color: theme.colors.primary }}>
                    Something went wrong
                </h2>

                <p style={{ color: theme.colors.textSecondary }}>
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="training-page">

            {/* Header */}

            <div className="training-header">
                <h1 style={{ color: theme.colors.primary }}>
                    🎯 Training & Placement Preparation
                </h1>

                <p style={{ color: theme.colors.textSecondary }}>
                    Training materials specifically selected
                    for your academic year.
                </p>
            </div>

            {/* Year */}

            <div
                className="year-card"
                style={{
                    background: theme.colors.card,
                    border: `1px solid ${theme.colors.border}`,
                }}
            >
                <h2 style={{ color: theme.colors.text }}>
                    🎓 {getYearLabel(year)}
                </h2>

                <p style={{ color: theme.colors.textSecondary }}>
                    Showing training materials available
                    for your academic year.
                </p>
            </div>

            {/* Categories */}

            <div className="training-categories">

                <div
                    className="category-card"
                    style={{
                        background: theme.colors.card,
                        border: `1px solid ${theme.colors.border}`,
                    }}
                >
                    <h3 style={{ color: theme.colors.text }}>
                        🎯 Placement Preparation
                    </h3>

                    <p style={{ color: theme.colors.textSecondary }}>
                        Prepare for upcoming placement drives
                        and company recruitment processes.
                    </p>
                </div>

                <div
                    className="category-card"
                    style={{
                        background: theme.colors.card,
                        border: `1px solid ${theme.colors.border}`,
                    }}
                >
                    <h3 style={{ color: theme.colors.text }}>
                        🧠 Aptitude
                    </h3>

                    <p style={{ color: theme.colors.textSecondary }}>
                        Practice quantitative, logical and
                        verbal aptitude.
                    </p>
                </div>

                <div
                    className="category-card"
                    style={{
                        background: theme.colors.card,
                        border: `1px solid ${theme.colors.border}`,
                    }}
                >
                    <h3 style={{ color: theme.colors.text }}>
                        💻 Coding & DSA
                    </h3>

                    <p style={{ color: theme.colors.textSecondary }}>
                        Improve programming skills and
                        problem-solving ability.
                    </p>
                </div>

                <div
                    className="category-card"
                    style={{
                        background: theme.colors.card,
                        border: `1px solid ${theme.colors.border}`,
                    }}
                >
                    <h3 style={{ color: theme.colors.text }}>
                        🗣 Communication
                    </h3>

                    <p style={{ color: theme.colors.textSecondary }}>
                        Improve communication and
                        interview skills.
                    </p>
                </div>

                <div
                    className="category-card"
                    style={{
                        background: theme.colors.card,
                        border: `1px solid ${theme.colors.border}`,
                    }}
                >
                    <h3 style={{ color: theme.colors.text }}>
                        📄 Resume & Interview
                    </h3>

                    <p style={{ color: theme.colors.textSecondary }}>
                        Learn resume building and
                        interview preparation.
                    </p>
                </div>

            </div>

            {/* Materials */}

            <div className="materials-section">

                <h2 style={{ color: theme.colors.primary }}>
                    📚 Your Training Materials
                </h2>

                {materials.length === 0 ? (

                    <div
                        className="empty-training"
                        style={{
                            background: theme.colors.card,
                            border: `1px solid ${theme.colors.border}`,
                        }}
                    >
                        <h3 style={{ color: theme.colors.text }}>
                            📚 No materials available yet
                        </h3>

                        <p style={{ color: theme.colors.textSecondary }}>
                            Your teachers have not uploaded
                            training materials for{" "}
                            {getYearLabel(year)} yet.
                        </p>
                    </div>

                ) : (

                    <div className="training-grid">

                        {materials.map((material) => (

                            <div
                                className="training-card"
                                key={material._id}
                                style={{
                                    background: theme.colors.card,
                                    border: `1px solid ${theme.colors.border}`,
                                }}
                            >

                                <h3 style={{ color: theme.colors.text }}>
                                    {material.title}
                                </h3>

                                <p
                                    style={{
                                        color: theme.colors.textSecondary,
                                    }}
                                >
                                    {material.description}
                                </p>

                                {material.category && (
                                    <span className="material-category">
                                        {material.category}
                                    </span>
                                )}

                                {material.type && (
                                    <p
                                        style={{
                                            color: theme.colors.textSecondary,
                                        }}
                                    >
                                        Type: {material.type}
                                    </p>
                                )}

                                {material.link && (
                                    <a
                                        href={material.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open Material →
                                    </a>
                                )}

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Training;