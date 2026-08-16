function ProgressBar({ title, progress, color }) {
    return (
        <div style={{ marginBottom: "20px" }}>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    fontWeight: "bold",
                }}
            >
                <span>{title}</span>
                <span>{progress}%</span>
            </div>

            <div
                style={{
                    width: "260px",
                    height: "10px",
                    background: "#374151",
                    borderRadius: "20px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${progress}%`,
                        height: "100%",
                        background: color,
                        borderRadius: "20px",
                    }}
                ></div>
            </div>

        </div>
    );
}

export default ProgressBar;