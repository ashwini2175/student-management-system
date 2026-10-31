import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Form, field } from "../components";
import { useSession } from "../state";
import { api } from "../api";
export default function Auth() {
  const { session, login } = useSession();
  const [role, setRole] = useState("Student");
  const [register, setRegister] = useState(false);
  if (session) return <Navigate to="/dashboard" replace />;
  return <main className="auth">
    <section className="auth-intro"><p className="eyebrow">CAMPUS → CAREER</p><h1>Your next chapter<br />starts here.</h1><p>Build your profile. Get guidance.<br />Stay ready for your next opportunity.</p><div className="auth-note">Student & teacher workspace<strong>Connected. Personal. Live.</strong></div></section>
    <section className="auth-form"><Link className="brand" to="/login">◈ Placement Portal</Link><h2>{register ? "Create student account" : "Welcome back"}</h2><p className="muted">{register ? "Start with your academic details." : "Sign in to your campus workspace."}</p>
      {!register && <div className="tabs">{["Student", "Teacher"].map(r => <button key={r} className={role === r ? "" : "secondary"} onClick={() => setRole(r)}>{r}</button>)}</div>}
      <Form key={`${role}-${register}`} fields={register ? [field("name", "Full name"), field("prn", "PRN"), field("email", "Email", "email"), field("department", "Department"), field("year", "Year", "select", { options: [1, 2, 3, 4] }), field("cgpa", "CGPA", "number", { min: 0, max: 10, step: 0.01 }), field("password", "Password", "password", { hint: "At least 8 characters; maximum 72 UTF-8 bytes." })] : [field(role === "Student" ? "prn" : "employeeId", role === "Student" ? "PRN" : "Employee ID"), ...(role === "Teacher" ? [field("department", "Department")] : []), field("password", "Password", "password")]} label={register ? "Create account" : "Sign in"} submit={v => register ? api("/student", { method: "POST", body: v }) : login(role, v)} />
      <button className="text-button" onClick={() => { setRole("Student"); setRegister(!register); }}>{register ? "Already registered? Sign in" : "New student? Create an account"}</button>
      <Link to="/forgot-password">Forgot password?</Link>
      <p className="muted small">Teacher accounts are provisioned by the administrator. Email ownership is not verified during registration.</p>
    </section>
  </main>;
}
