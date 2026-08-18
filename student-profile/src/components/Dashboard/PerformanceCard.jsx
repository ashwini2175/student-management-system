import theme from "../../styles/theme";

function PerformanceCard({ student }) {
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
            <h2>📈 Performance Analysis</h2>

            <p>
                Placement Score : {student?.placementScore ?? "N/A"}
            </p>

            <p>
                Placement Status : {student?.placementStatus ?? "N/A"}
            </p>

            <p>
                CGPA : {student?.cgpa ?? "N/A"}
            </p>

            <p>
                Placement Status :{" "}
                {student?.placementStatus ?? "N/A"}
            </p>


        </div>
    );
}

export default PerformanceCard;