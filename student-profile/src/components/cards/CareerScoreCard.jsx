import theme from "../../styles/theme";

function CareerScoreCard({ score = 82 }) {
    let color = theme.colors.success;
    let status = "Excellent";

    if (score < 80 && score >= 50) {
        color = theme.colors.warning;
        status = "Good Progress";
    }

    if (score < 50) {
        color = theme.colors.danger;
        status = "Needs Improvement";
    }

    return (
        <div
            style={{
                background: theme.colors.card,
                borderRadius: "15px",
                padding: "20px",
                border: `1px solid ${theme.colors.border}`,
                boxShadow: theme.colors.shadow,
            }}
        >
            <h2 style={{ color: theme.colors.text }}>
                ⭐ Overall Career Score
            </h2>

            <h1
                style={{
                    fontSize: "48px",
                    margin: "15px 0",
                    color,
                }}
            >
                {score}/100
            </h1>

            <p
                style={{
                    color,
                    fontWeight: "bold",
                    fontSize: "18px",
                }}
            >
                {status}
            </p>
        </div>
    );
}

export default CareerScoreCard;