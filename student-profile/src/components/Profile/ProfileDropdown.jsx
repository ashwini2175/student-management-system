function ProfileDropdown() {
    return (
        <div
            style={{
                position: "absolute",
                right: 0,
                top: "55px",
                width: "220px",
                background: "theme.colors.card",
                borderRadius: "12px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                padding: "15px",
                zIndex: 1000,
            }}
        >
            <h3 style={{ margin: 0 }}>Ashwini Vasave</h3>

            <p style={{ color: "gray" }}>Final Year Student</p>

            <hr />

            <p style={{ cursor: "pointer" }}>👤 My Profile</p>

            <p style={{ cursor: "pointer" }}>⚙ Settings</p>

            <p style={{ cursor: "pointer", color: "red" }}>Logout</p>
        </div>
    );
}

export default ProfileDropdown;