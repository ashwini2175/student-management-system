import { useState } from "react";
import { FiGrid, FiUsers, FiMessageSquare, FiBriefcase, FiBookOpen, FiSettings, FiUser, FiFolder, FiAward, FiCompass, FiBell, FiMenu, FiX } from "react-icons/fi";
import {
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useSession, useQuery } from "./state";
import PasswordRecovery from "./pages/PasswordRecovery";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Certificates from "./pages/Certificates";
import Career from "./pages/Career";
import Placements from "./pages/Placements";
import Guidance from "./pages/Guidance";
import Training from "./pages/Training";
import Notifications from "./pages/Notifications";
import Students, { StudentDetail } from "./pages/Students";
import Settings from "./pages/Settings";
function NotificationCount() {
  const { session } = useSession();
  const q = useQuery(
    "/notification/" + encodeURIComponent(session.account.prn),
  );
  const count = q.data?.filter((n) => !n.isRead).length || 0;
  return count ? <span className="count">{count}</span> : null;
}
function Layout() {
  const { session, logout, live } = useSession();
  const teacher = session.role === "Teacher";
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const icons = { dashboard: FiGrid, students: FiUsers, guidance: FiMessageSquare, placements: FiBriefcase, training: FiBookOpen, settings: FiSettings, profile: FiUser, projects: FiFolder, certificates: FiAward, career: FiCompass, notifications: FiBell };
  const links = teacher
    ? [
        ["dashboard", "Overview"],
        ["students", "Students"],
        ["guidance", "Guidance"],
        ["placements", "Placement drives"],
        ["training", "Materials"],
        ["settings", "Settings"],
      ]
    : [
        ["dashboard", "Overview"],
        ["profile", "Profile"],
        ["projects", "Projects"],
        ["certificates", "Certificates"],
        ["career", "Career & guidance"],
        ["training", "Materials"],
        ["notifications", "Notifications"],
        ["settings", "Settings"],
      ];
  return (
    <div className="shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <aside className={"sidebar " + (menuOpen ? "menu-open" : "")}>
        <NavLink to="/dashboard" className="brand">
          ◈ Placement Portal
        </NavLink>
        <button className="menu-toggle secondary" aria-expanded={menuOpen} aria-controls="workspace-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <FiX /> : <FiMenu />} {menuOpen ? "Close menu" : "Menu"}</button>
        <p className="sidebar-label">{session.role} workspace</p>
        <nav id="workspace-navigation" aria-label="Main navigation">
          {links.map(([path, label]) => {
            const Icon = icons[path];
            return (
            <NavLink key={path} to={"/" + path} onClick={() => setMenuOpen(false)}>
              <Icon aria-hidden="true" /><span className="nav-label">{label}</span>
              {path === "notifications" && <NotificationCount />}
            </NavLink>
          );})}
        </nav>
        <div className="sidebar-bottom">
          <span className={"live " + (live === "Live" ? "online" : "")}>
            ● {live}
          </span>
          <strong>{session.account.name}</strong>
          <button className="secondary" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="content" id="main-content" tabIndex={-1}>
        <div className="workspace-topbar"><span>{session.role} workspace <span className="breadcrumb-separator">/</span> <strong>{links.find(([path]) => pathname.startsWith("/" + path))?.[1] || "Student details"}</strong></span><span className="account-chip"><span className="account-initial">{session.account.name?.charAt(0)}</span>{session.account.name}</span></div>
        <Outlet />
        <footer>Placement Portal · Learn. Build. Grow.</footer>
      </main>
    </div>
  );
}
function Guard({ role }) {
  const { session, ready } = useSession();
  if (!ready) return <p className="card">Restoring your session…</p>;
  if (!session) return <Navigate to="/login" replace />;
  if (role && session.role !== role)
    return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
function Legacy() {
  const { pathname } = useLocation();
  const paths = {
    "/teacher/dashboard": "/dashboard",
    "/teacher/students": "/students",
    "/teacher/guidance": "/guidance",
    "/teacher/placement": "/placements",
    "/teacher/student-details": "/students",
    "/resources": "/training",
  };
  return <Navigate to={paths[pathname] || "/dashboard"} replace />;
}
export default function App() {
  return (
    <Routes>
      <Route path="/forgot-password" element={<PasswordRecovery />} />
      <Route path="/reset-password" element={<PasswordRecovery reset />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/student-login" element={<Navigate to="/login" replace />} />
      <Route path="/teacher-login" element={<Navigate to="/login" replace />} />
      <Route element={<Guard />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="training" element={<Training />} />
          <Route path="settings" element={<Settings />} />
          <Route element={<Guard role="Student" />}>
            <Route path="profile" element={<Profile />} />
            <Route path="projects" element={<Projects />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="career" element={<Career />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          <Route element={<Guard role="Teacher" />}>
            <Route path="students" element={<Students />} />
            <Route path="students/:prn" element={<StudentDetail />} />
            <Route path="placements" element={<Placements />} />
            <Route path="guidance" element={<Guidance />} />
          </Route>
          <Route path="*" element={<Legacy />} />
        </Route>
      </Route>
    </Routes>
  );
}
