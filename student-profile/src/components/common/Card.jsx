import theme from "../../styles/theme";

function Card({ children, style = {} }) {
    return (
        <div
            style={{
                background: theme.colors.card,
                color: theme.colors.text,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: "18px",
                padding: "25px",
                boxShadow: theme.colors.shadow,
                ...style,
            }}
        >
            {children}
        </div>
    );
}

export default Card;