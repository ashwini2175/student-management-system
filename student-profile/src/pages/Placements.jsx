import { useState } from "react";
import { api, date, today } from "../api";
import { useQuery, useSession } from "../state";
import { Form, Heading, Status, Empty, Action, field } from "../components";
export function DriveList({ teacher = false }) {
  const q = useQuery("/placement");
  const [past, setPast] = useState(false);
  const drives = (q.data || []).filter((p) => past || p.driveDate >= today());
  return (
    <>
      <label className="check">
        <input
          type="checkbox"
          checked={past}
          onChange={(e) => setPast(e.target.checked)}
        />{" "}
        Include past drives
      </label>
      <Status query={q} />
      {!q.loading && !q.error && !drives.length && (
        <Empty>No upcoming placement drives.</Empty>
      )}
      <div className="grid">
        {drives.map((p) => (
          <article className="card" key={p._id}>
            <span className="badge">
              {date(p.driveDate)} · {p.time} IST
            </span>
            <h2>{p.company}</h2>
            <h3>{p.role}</h3>
            <p className="muted">
              CGPA {p.eligibilityCGPA}+ · {p.package}
            </p>
            <details>
              <summary>View details</summary>
              <p>
                <strong>Location:</strong> {p.location}
              </p>
              <p className="prewrap">
                {p.description || "No additional details."}
              </p>
            </details>
            {teacher && (
              <div className="button-row">
                <Action
                  method="POST"
                  path={"/placement/" + p._id + "/notifications"}
                >
                  Retry notifications
                </Action>
                <Action
                  path={"/placement/" + p._id}
                  confirmMessage="Delete this drive and its linked notifications?"
                >
                  Delete
                </Action>
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
export default function Placements() {
  const { refresh } = useSession();
  return (
    <>
      <Heading
        title="Placement drives"
        subtitle="Publish opportunities. Eligible students receive notifications automatically."
      />
      <details className="section">
        <summary>Create a placement drive</summary>
        <Form
          fields={[
            field("company", "Company"),
            field("role", "Job role"),
            field("eligibilityCGPA", "Minimum CGPA", "number", {
              min: 0,
              max: 10,
              step: 0.01,
            }),
            field("package", "Package (e.g. 6 LPA)"),
            field("driveDate", "Drive date", "date"),
            field("time", "Time (IST)", "time"),
            field("location", "Location"),
            field("description", "Description", "textarea", {
              required: false,
            }),
          ]}
          submit={(v) => api("/placement", { method: "POST", body: v })}
          onSuccess={refresh}
        />
      </details>
      <DriveList teacher />
    </>
  );
}
