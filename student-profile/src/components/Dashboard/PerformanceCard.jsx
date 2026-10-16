import theme from "../../styles/theme";

function PerformanceCard({ student }) {
    return (
        <div
            style={{
                background: theme.colors.card,
                padding: "30px",
                borderRadius: "18px",
                border: `1px solid ${theme.colors.border}`,
                marginBottom: "25px",
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
                    <strong>CGPA</strong>
                    <p>{student?.cgpa ?? "N/A"}</p>
                </div>

                <div>
                    <strong>Placement Score</strong>
                    <p>{student?.placementScore ?? "N/A"}</p>
                </div>

                <div>
                    <strong>Placement Status</strong>
                    <p>{student?.placementStatus ?? "N/A"}</p>
                </div>

                <div>
                    <strong>Aptitude Score</strong>
                    <p>{student?.aptitudeScore ?? "N/A"}</p>
                </div>

                <div>
                    <strong>Communication Score</strong>
                    <p>{student?.communicationScore ?? "N/A"}</p>
                </div>

                <div>
                    <strong>Resume</strong>
                    <p>
                        {student?.resumeUploaded
                            ? "✅ Uploaded"
                            : "❌ Not Uploaded"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PerformanceCard;