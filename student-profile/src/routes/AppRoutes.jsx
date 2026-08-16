import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import Resources from "../pages/Resources";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import Career from "../pages/Career";
import StudentLogin from "../pages/StudentLogin";
import Training from "../pages/Training";
function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="resources" element={<Resources />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
                <Route path="career" element={<Career />} />
                <Route path="training" element={<Training />} />
                <Route path="student-login" element={<StudentLogin />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;