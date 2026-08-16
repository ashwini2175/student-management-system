import theme from "../../styles/theme";

function StatsCard({ title, value, color }) {
    return (
        <div
            style={{
                background: theme.colors.card,
                color: theme.colors.text,
                flex: "1 1 220px",
                height: "140px",
                width: "260px",
                borderRadius: "15px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                border: `1px solid ${theme.colors.border}`,
            }}
        >
            <h2>{title}</h2>

            <h1
                style={{
                    fontSize: "55px",
                    marginTop: "10px",
                    color: color || theme.colors.primary,
                }}
            >
                {value}
            </h1>
        </div>
    );
}

export default StatsCard;