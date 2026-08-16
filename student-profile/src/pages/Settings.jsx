import theme from "../styles/theme";

function Settings() {
    return (
        <div>
            <h1 style={{ color: theme.colors.text }}>
                ⚙️ Settings
            </h1>

            <p style={{ color: theme.colors.textSecondary }}>
                Manage your account settings.
            </p>

            <div
                style={{
                    marginTop: "30px",
                    background: theme.colors.surface,
                    padding: "25px",
                    borderRadius: "15px",
                    border: `1px solid ${theme.colors.border}`,
                }}
            >
                <h2 style={{ color: theme.colors.text }}>
                    Personal Information
                </h2>

                <div style={{ marginTop: "20px" }}>
                    <label>Name</label>
                    <input
                        type="text"
                        defaultValue="Ashwini Vasave"
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            marginBottom: "15px",
                        }}
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        defaultValue="ashwini@example.com"
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Settings;