import theme from "../styles/theme";

function Career() {
    const skills = [
        { name: "React", progress: 85 },
        { name: "JavaScript", progress: 80 },
        { name: "Node.js", progress: 60 },
        { name: "MongoDB", progress: 65 },
        { name: "DSA", progress: 55 },
    ];

    const placementDrives = [
        {
            company: "TCS",
            role: "Software Developer",
            eligibility: "CGPA 7.0+",
            package: "7 LPA",
            date: "Coming Soon",
        },
        {
            company: "Infosys",
            role: "Systems Engineer",
            eligibility: "CGPA 6.5+",
            package: "6 LPA",
            date: "Coming Soon",
        },
    ];

    const preparation = [
        {
            title: "Aptitude",
            icon: "🧠",
            description: "Practice quantitative, logical and verbal aptitude.",
        },
        {
            title: "Coding & DSA",
            icon: "💻",
            description: "Improve problem-solving and coding skills.",
        },
        {
            title: "Technical Interview",
            icon: "⚙️",
            description: "Prepare core technical concepts and interview questions.",
        },
        {
            title: "HR Interview",
            icon: "🗣️",
            description: "Practice communication and HR interview questions.",
        },
        {
            title: "Resume Preparation",
            icon: "📄",
            description: "Build a professional and placement-ready resume.",
        },
    ];

    return (
        <div>
            {/* Header */}
            <h1
                style={{
                    color: theme.colors.primary,
                    marginBottom: "8px",
                }}
            >
                💼 Career & Placement
            </h1>

            <p
                style={{
                    color: "#cbd5e1",
                    marginBottom: "30px",
                }}
            >
                Track your placement readiness and prepare for upcoming
                career opportunities.
            </p>

            {/* Placement Overview */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    marginBottom: "30px",
                }}
            >
                <div
                    style={{
                        background: theme.colors.card,
                        padding: "20px",
                        borderRadius: "15px",
                        border: `1px solid ${theme.colors.border}`,
                    }}
                >
                    <div style={{ fontSize: "30px" }}>🏢</div>
                    <h2
                        style={{
                            color: theme.colors.primary,
                            margin: "10px 0",
                        }}
                    >
                        {placementDrives.length}
                    </h2>
                    <p style={{ color: theme.colors.text }}>
                        Available Companies
                    </p>
                </div>

                <div
                    style={{
                        background: theme.colors.card,
                        padding: "20px",
                        borderRadius: "15px",
                        border: `1px solid ${theme.colors.border}`,
                    }}
                >
                    <div style={{ fontSize: "30px" }}>📢</div>
                    <h2
                        style={{
                            color: theme.colors.primary,
                            margin: "10px 0",
                        }}
                    >
                        {placementDrives.length}
                    </h2>
                    <p style={{ color: theme.colors.text }}>
                        Placement Drives
                    </p>
                </div>

                <div
                    style={{
                        background: theme.colors.card,
                        padding: "20px",
                        borderRadius: "15px",
                        border: `1px solid ${theme.colors.border}`,
                    }}
                >
                    <div style={{ fontSize: "30px" }}>🎯</div>
                    <h2
                        style={{
                            color: theme.colors.primary,
                            margin: "10px 0",
                        }}
                    >
                        82%
                    </h2>
                    <p style={{ color: theme.colors.text }}>
                        Placement Readiness
                    </p>
                </div>
            </div>

            {/* Upcoming Drives */}
            <h2
                style={{
                    color: theme.colors.primary,
                    marginBottom: "20px",
                }}
            >
                📢 Upcoming Placement Drives
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px",
                    marginBottom: "35px",
                }}
            >
                {placementDrives.map((drive) => (
                    <div
                        key={drive.company}
                        style={{
                            background: theme.colors.card,
                            padding: "22px",
                            borderRadius: "15px",
                            border: `1px solid ${theme.colors.border}`,
                        }}
                    >
                        <h2
                            style={{
                                color: theme.colors.text,
                                marginTop: 0,
                            }}
                        >
                            🏢 {drive.company}
                        </h2>

                        <p style={{ color: theme.colors.textSecondary }}>
                            <strong>Role:</strong> {drive.role}
                        </p>

                        <p style={{ color: theme.colors.textSecondary }}>
                            <strong>Eligibility:</strong> {drive.eligibility}
                        </p>

                        <p style={{ color: theme.colors.textSecondary }}>
                            <strong>Package:</strong> {drive.package}
                        </p>

                        <p style={{ color: theme.colors.textSecondary }}>
                            <strong>Drive Date:</strong> {drive.date}
                        </p>

                        <button
                            style={{
                                marginTop: "10px",
                                padding: "10px 16px",
                                border: "none",
                                borderRadius: "8px",
                                background: theme.colors.primary,
                                color: "#ffffff",
                                cursor: "pointer",
                            }}
                        >
                            View Details →
                        </button>
                    </div>
                ))}
            </div>

            {/* Placement Readiness */}
            <div
                style={{
                    background: theme.colors.card,
                    padding: "25px",
                    borderRadius: "15px",
                    border: `1px solid ${theme.colors.border}`,
                    marginBottom: "35px",
                }}
            >
                <h2 style={{ color: theme.colors.text }}>
                    🎯 Placement Readiness
                </h2>

                <h1 style={{ color: theme.colors.primary }}>
                    82%
                </h1>

                {skills.map((skill) => (
                    <div
                        key={skill.name}
                        style={{
                            marginTop: "18px",
                            color: theme.colors.text,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <span>{skill.name}</span>
                            <span>{skill.progress}%</span>
                        </div>

                        <div
                            style={{
                                width: "100%",
                                height: "10px",
                                background: "#e5e7eb",
                                borderRadius: "20px",
                                marginTop: "6px",
                            }}
                        >
                            <div
                                style={{
                                    width: `${skill.progress}%`,
                                    height: "100%",
                                    background: theme.colors.primary,
                                    borderRadius: "20px",
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Placement Preparation */}
            <h2
                style={{
                    color: theme.colors.primary,
                    marginBottom: "20px",
                }}
            >
                🚀 Placement Preparation
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                }}
            >
                {preparation.map((item) => (
                    <div
                        key={item.title}
                        style={{
                            background: theme.colors.card,
                            padding: "20px",
                            borderRadius: "15px",
                            border: `1px solid ${theme.colors.border}`,
                        }}
                    >
                        <div style={{ fontSize: "32px" }}>
                            {item.icon}
                        </div>

                        <h3
                            style={{
                                color: theme.colors.text,
                            }}
                        >
                            {item.title}
                        </h3>

                        <p
                            style={{
                                color: theme.colors.textSecondary,
                                lineHeight: "1.5",
                            }}
                        >
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Career;