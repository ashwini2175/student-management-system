import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaProjectDiagram,
    FaBook,
    FaBell,
    FaCog,
    FaBriefcase,
} from "react-icons/fa";

import theme from "../../styles/theme.js";

function Sidebar() {
    const menuStyle = ({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        marginBottom: "10px",
        borderRadius: "10px",
        textDecoration: "none",
        color: isActive ? "theme.colors.card" : theme.colors.text,
        background: isActive ? theme.colors.primary : "transparent",
        fontWeight: isActive ? "600" : "500",
        transition: "0.3s",
    });

    return (
        <aside
            style={{
                width: "260px",
                minHeight: "100vh",
                background: theme.colors.sidebar,
                borderRight: `1px solid ${theme.colors.border}`,
                padding: "25px",
            }}
        >
            <h2
                style={{
                    color: theme.colors.primary,
                    marginBottom: "35px",
                    textAlign: "center",
                }}
            >
                Student Portal
            </h2>

            <nav>
                <NavLink to="/" style={menuStyle}>
                    <FaHome />
                    Dashboard
                </NavLink>

                <NavLink to="/projects" style={menuStyle}>
                    <FaProjectDiagram />
                    Projects
                </NavLink>



                <NavLink to="/career" style={menuStyle}>
                    <FaBriefcase />
                    Career
                </NavLink>

                <NavLink to="/notifications" style={menuStyle}>
                    <FaBell />
                    Notifications
                </NavLink>

                <NavLink to="/settings" style={menuStyle}>
                    <FaCog />
                    Settings
                </NavLink>

                <NavLink to="/training" style={menuStyle}>
                    <FaBook />
                    Training
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;