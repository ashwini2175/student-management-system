import theme from "../../styles/theme";

function WelcomeBanner({ student }) {
    return (
        <div
            style={{
                background: theme.colors.card,
                padding: "25px",
                borderRadius: "18px",
                marginBottom: "25px",
                border: `1px solid ${theme.colors.border}`,
            }}
        >
            <h1
                style={{
                    margin: 0,
                    color: theme.colors.text,
                }}
            >
                👋 Welcome Back, {student?.name || "Student"}
            </h1>

            <p
                style={{
                    color: theme.colors.textSecondary,
                }}
            >
                Keep learning. Keep building.
                Every project brings you one step closer to your dream placement 🚀
            </p>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "15px",
                    flexWrap: "wrap",
                }}
            >
                <span>🟢 Online</span>

                <span>{student?.year || "Student"}</span>

                <span>{student?.department || "CSE"}</span>

                <span>{new Date().toLocaleDateString()}</span>
            </div>
        </div>
    );
}

export default WelcomeBanner;