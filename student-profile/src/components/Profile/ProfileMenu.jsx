import { useState } from "react";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

function ProfileMenu() {

    const [open, setOpen] = useState(false);

    return (

        <div
            style={{
                position: "relative",
            }}
        >

            <div
                onClick={() => setOpen(!open)}
            >
            </div>
            {
                open && (

                    <div
                        style={{
                            position: "absolute",
                            top: "60px",
                            right: 0,
                            width: "260px",
                            background: "theme.colors.card",
                            borderRadius: "12px",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                            overflow: "hidden",
                            zIndex: 999,
                        }}
                    >

                        <div
                            style={{
                                padding: "20px",
                                textAlign: "center",
                                borderBottom: "1px solid #ddd",
                            }}
                        >

                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    background: "#2563eb",
                                    color: "white",
                                    margin: "auto",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "25px",
                                    fontWeight: "bold",
                                }}
                            >
                                {student.name.charAt(0)}
                            </div>

                            <h3>{student.name}</h3>

                            <p>
                                {student.year} • {student.department}
                            </p>

                        </div>

                        <MenuItem
                            icon={<FaUser />}
                            text="My Profile"
                            onClick={() => navigate("/profile")}
                        />

                        <MenuItem
                            icon={<FaCog />}
                            text="Settings"
                            onClick={() => navigate("Settings")}
                        />

                        <MenuItem
                            icon={<FaSignOutAlt />}
                            text="Logout"
                            onClick={() => navigate("Logout")}
                        />

                    </div>

                )
            }

        </div>

    );
}

function MenuItem({ icon, text }) {

    return (

        <div
            style={{
                display: "flex",
                gap: "15px",
                padding: "15px 20px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
            }}
        >

            {icon}

            {text}

        </div>

    );

}

export default ProfileMenu;