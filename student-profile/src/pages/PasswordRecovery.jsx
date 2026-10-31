import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, field } from "../components";
import { api } from "../api";
export default function PasswordRecovery({ reset = false }) {
  const [params] = useState(() => new URLSearchParams(window.location.hash.slice(1)));
  const [done, setDone] = useState(false);
  return <main className="auth">
    <section className="auth-intro"><p className="eyebrow">PLACEMENT PORTAL</p><h1>Get back to<br />your next chapter.</h1><p>Reset your password securely through your registered email.</p></section>
    <section className="auth-form">
      <h2>{reset ? "Choose a new password" : "Forgot password?"}</h2>
      <p className="muted">{reset ? "The link expires after 15 minutes and can be used once." : "Enter your account ID and the email saved in your profile."}</p>
      {done ? <p role="status" className="notice success">Password updated. Sign in with your new password.</p> :
        <Form fields={reset ? [field("newPassword", "New password", "password", { hint: "At least 8 characters; maximum 72 UTF-8 bytes." }), field("confirmPassword", "Confirm password", "password")] : [field("role", "Account type", "select", { options: ["Student", "Teacher"] }), field("identifier", "PRN / Employee ID"), field("email", "Registered email", "email")]}
          label={reset ? "Reset password" : "Send reset link"}
          submit={async (values) => {
            if (!reset) return api("/auth/forgot-password", { method: "POST", body: values });
            if (values.newPassword !== values.confirmPassword) throw new Error("Passwords do not match.");
            const result = await api("/auth/reset-password", { method: "POST", body: { role: params.get("role"), token: params.get("token"), newPassword: values.newPassword } });
            window.history.replaceState(null, "", window.location.pathname);
            return result;
          }} onSuccess={reset ? () => setDone(true) : undefined} />}
      <p><Link to="/login">Back to sign in</Link></p>
      {reset && <Link to="/forgot-password">Request a new reset link</Link>}
    </section>
  </main>;
}
