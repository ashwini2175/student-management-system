import theme from "../../styles/theme";

function PageHeader({ title, subtitle }) {
    return (
        <div style={{ marginBottom: "30px" }}>
            <h1
                style={{
                    color: "white",
                    marginBottom: "8px",
                }}
            >
                {title}
            </h1>

            <p
                style={{
                    color: "white",
                }}
            >
                {subtitle}
            </p>
        </div>
    );
}

export default PageHeader;