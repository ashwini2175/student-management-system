import student from "../../data/student";
import theme from "../../styles/theme";

function StatsCards() {
    const cards = [
        {
            title: "CGPA",
            value: student.cgpa,
            icon: "🎓",
        },
        {
            title: "Projects",
            value: student.projects.length,
            icon: "💻",
        },
        {
            title: "Skills",
            value: student.skills.length,
            icon: "⚡",
        },
        {
            title: "Training",
            value: "View",
            icon: "🎯",
        },
    ];

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                marginBottom: "30px",
            }}
        >
            {cards.map((card) => (
                <div
                    key={card.title}
                    style={{
                        background: theme.colors.card,
                        padding: "30px",
                        borderRadius: "15px",
                        border: `1px solid ${theme.colors.border}`,
                        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                    }}
                >
                    <div
                        style={{
                            fontSize: "38px",
                        }}
                    >
                        {card.icon}
                    </div>

                    <h2
                        style={{
                            fontSize: "38px",
                            margin: "10px 0",
                            color: theme.colors.primary,
                        }}
                    >
                        {card.value}
                    </h2>

                    <p
                        style={{
                            color: theme.colors.textLight,
                            marginTop: "10px",
                            fontWeight: "600",
                        }}
                    >
                        {card.title}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default StatsCards;