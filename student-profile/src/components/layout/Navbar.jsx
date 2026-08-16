import { FaBell, FaUser } from "react-icons/fa";
import { useState } from "react";
import { useContext } from "react"; import theme from "../../styles/theme";
import SearchBar from "../common/SearchBar";
import ProfileDropdown from "../Profile/ProfileDropdown";



function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            style={{
                height: "70px",
                background: theme.colors.surface,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 30px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >
            <h2
                style={{
                    color: theme.colors.primary,
                    margin: 0,
                }}
            >
                Student    Portal
            </h2>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                }}
            >
                <SearchBar />

                <FaBell
                    size={20}
                    style={{ cursor: "pointer" }}
                />



                <div
                    style={{
                        position: "relative",
                    }}
                ><div
                        style={{
                            width: "10px",
                            height: "10px",
                            background: theme.colors.success,
                            borderRadius: "50%",
                        }}
                    />
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            width: "45px",
                            height: "45px",
                            borderRadius: "50%",
                            background: theme.colors.primary,
                            color: "white",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        Ashwini Vasave
                        Final Year CSE
                    </div>

                    {isOpen && <ProfileDropdown />}
                </div>
            </div>
        </div>
    );
}

export default Navbar;