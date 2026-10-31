import { useSession } from "../state";
import { api } from "../api";
import { Form, Heading, field } from "../components";
export default function Settings() {
  const { logout } = useSession();
  return <><Heading title="Account settings" subtitle="Change your password. You will be signed out after saving." />
    <Form fields={[field("currentPassword", "Current password", "password"), field("newPassword", "New password", "password", { hint: "At least 8 characters; maximum 72 UTF-8 bytes." })]} submit={v => api("/auth/password", { method: "PUT", body: v })} onSuccess={logout} label="Update password & sign out" />
  </>;
}
