import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                width: "100%",
            }}
        >
            <Sidebar />

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Navbar />

                <main
                    style={{
                        flex: 1,
                        padding: "30px",
                        background: "#111827",
                        overflowY: "auto",
                    }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;