import theme from "../styles/theme";
import WelcomeBanner from "../components/Dashboard/WelcomeBanner";
import StatsCards from "../components/Dashboard/StatsCards";
import PerformanceCard from "../components/Dashboard/PerformanceCard";
import RecentActivity from "../components/Dashboard/RecentActivity";
import QuickActions from "../components/Dashboard/QuickActions";
function Dashboard() {

    return (
        <>
            {/* Welcome Card */}


            <>
                <WelcomeBanner />

                <StatsCards />

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr",
                        gap: "20px",
                    }}
                >
                    <PerformanceCard />

                    <RecentActivity />
                </div>

                <QuickActions />
            </>


        </>
    );
}

export default Dashboard;