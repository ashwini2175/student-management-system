import student from "../../data/student";
import theme from "../../styles/theme";

function PerformanceCard() {
    const placementReady = student.careerScore >= 70;

    return (
        <div
            style={{
                background: theme.colors.card,
                padding: "25px",
                borderRadius: "15px",
                border: `1px solid ${theme.colors.border}`,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
        >
            <h2
                style={{
                    marginBottom: "25px",
                    color: theme.colors.text,
                }}
            >
                📈 Performance Analysis
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px",
                }}
            >
                <div>
                    <p
                        style={{
                            color: theme.colors.textLight,
                            marginBottom: "5px",
                        }}
                    >
                        Career Score
                    </p>

                    <h3
                        style={{
                            fontSize: "28px",
                            margin: 0,
                            color: theme.colors.primary,
                        }}
                    >
                        {student.careerScore}/100
                    </h3>
                </div>

                <div>
                    <p
                        style={{
                            color: theme.colors.textLight,
                            marginBottom: "5px",
                        }}
                    >
                        Performance
                    </p>

                    <h3
                        style={{
                            fontSize: "28px",
                            margin: 0,
                        }}
                    >
                        {student.performance}
                    </h3>
                </div>

                <div>
                    <p
                        style={{
                            color: theme.colors.textLight,
                            marginBottom: "5px",
                        }}
                    >
                        CGPA
                    </p>

                    <h3
                        style={{
                            fontSize: "28px",
                            margin: 0,
                        }}
                    >
                        {student.cgpa}
                    </h3>
                </div>

                <div>
                    <p
                        style={{
                            color: theme.colors.textLight,
                            marginBottom: "5px",
                        }}
                    >
                        Placement Ready
                    </p>

                    <h3
                        style={{
                            fontSize: "22px",
                            margin: 0,
                        }}
                    >
                        {placementReady ? "Yes ✅" : "Needs Improvement ⚠️"}
                    </h3>
                </div>
            </div>
        </div>
    );
}

export default PerformanceCard;