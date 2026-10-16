import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WelcomeBanner from "../components/Dashboard/WelcomeBanner";
import StatsCards from "../components/Dashboard/StatsCards";
import PerformanceCard from "../components/Dashboard/PerformanceCard";
import RecentActivity from "../components/Dashboard/RecentActivity";
import QuickActions from "../components/Dashboard/QuickActions";

function Dashboard() {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/student-login");
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/student/profile",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    if (
                        response.status === 401 ||
                        data.message === "Invalid or Expired Token"
                    ) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("student");

                        navigate("/student-login");
                        return;
                    }

                    throw new Error(
                        data.message || "Failed to load student profile"
                    );
                }

                setStudent(data);
                console.log("STUDENT FROM BACKEND:", data);
                // Keep localStorage student data updated
                localStorage.setItem(
                    "student",
                    JSON.stringify(data)
                );

            } catch (error) {
                console.error("Dashboard Error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentProfile();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>Loading Dashboard...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>Unable to load dashboard</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "30px",
            }}
        >
            <WelcomeBanner student={student} />

            <StatsCards student={student} />

            <PerformanceCard student={student} />

            <RecentActivity student={student} />

            <QuickActions />
        </div>
    );
}

export default Dashboard;