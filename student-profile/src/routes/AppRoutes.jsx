import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Projects from "../pages/Projects";
import Resources from "../pages/Resources";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import Career from "../pages/Career";
import Training from "../pages/Training";
import Certificates from "../pages/Certificates";

import Login from "../pages/Login";
import StudentLogin from "../pages/StudentLogin";

import TeacherLogin from "../pages/TeacherLogin";
import TeacherDashboard from "../pages/TeacherDashboard";
import TeacherStudents from "../pages/TeacherStudents";
import TeacherGuidance from "../pages/Guidance";
import TeacherPlacement from "../pages/TeacherPlacement";
import TeacherStudentDetails from "../pages/TeacherStudentDetails";
import ResourceDetail from "../pages/ResourceDetail";

function AppRoutes() {
    return (
        <Routes>

            {/* =====================================
                MAIN LOGIN
            ===================================== */}

            <Route
                path="/login"
                element={<Login />}
            />


            {/* =====================================
                STUDENT LOGIN
            ===================================== */}

            <Route
                path="/student-login"
                element={<StudentLogin />}
            />


            {/* =====================================
                TEACHER LOGIN
            ===================================== */}

            <Route
                path="/teacher-login"
                element={<TeacherLogin />}
            />


            {/* =====================================
                TEACHER DASHBOARD
            ===================================== */}

            <Route
                path="/teacher/dashboard"
                element={<TeacherDashboard />}
            />


            {/* =====================================
                TEACHER STUDENTS
            ===================================== */}

            <Route
                path="/teacher/students"
                element={<TeacherStudents />}
            />


            {/* =====================================
                TEACHER GUIDANCE
            ===================================== */}

            <Route
                path="/teacher/guidance"
                element={<TeacherGuidance />}
            />


            {/* =====================================
                TEACHER PLACEMENT
            ===================================== */}

            <Route
                path="/teacher/placement"
                element={<TeacherPlacement />}
            />


            {/* =====================================
                STUDENT APPLICATION
            ===================================== */}

            <Route
                path="/"
                element={<MainLayout />}
            >
                <Route
                    index
                    element={<Dashboard />}
                />

                <Route
                    path="dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="profile"
                    element={<Profile />}
                />

                <Route
                    path="projects"
                    element={<Projects />}
                />

                <Route
                    path="resources"
                    element={<Resources />}
                />

                <Route
                    path="notifications"
                    element={<Notifications />}
                />

                <Route
                    path="settings"
                    element={<Settings />}
                />

                <Route
                    path="career"
                    element={<Career />}
                />

                <Route
                    path="training"
                    element={<Training />}
                />

                <Route
                    path="certificates"
                    element={<Certificates />}
                />
            </Route>


            {/* =====================================
                RESOURCE DETAIL
            ===================================== */}

            <Route
                path="/resources/:id"
                element={<ResourceDetail />}
            />

            {/* =====================================
                STUDENT DETAILS
            ===================================== */}

            <Route
                path="/teacher/student-details"
                element={<TeacherStudentDetails />}
            />

        </Routes>

    );
}

export default AppRoutes;