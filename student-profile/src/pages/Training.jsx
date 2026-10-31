import { api, safeLink } from "../api";
import { useQuery, useSession } from "../state";
import { Form, Heading, Status, Empty, Action, field } from "../components";
export default function Training() {
  const { session, refresh } = useSession();
  const teacher = session.role === "Teacher";
  const q = useQuery("/training");
  return (
    <>
      <Heading
        title="Learning materials"
        subtitle={
          teacher
            ? "Share preparation resources by academic year."
            : "Resources selected for your current academic year."
        }
      />
      {teacher && (
        <details className="section">
          <summary>Add learning material</summary>
          <Form
            fields={[
              field("title", "Title"),
              field("year", "Year", "select", { options: [1, 2, 3, 4] }),
              field("category", "Category"),
              field("type", "Type", "select", {
                options: ["PDF", "Video", "Link", "Practice"],
              }),
              field("link", "Resource URL", "url"),
              field("description", "Description", "textarea", {
                required: false,
              }),
            ]}
            submit={(v) => api("/training", { method: "POST", body: v })}
            onSuccess={refresh}
          />
        </details>
      )}
      <Status query={q} />
      {!q.loading && !q.error && !q.data?.length && (
        <Empty>No learning materials available yet.</Empty>
      )}
      <div className="grid">
        {q.data?.map((m) => (
          <article className="card" key={m._id}>
            <span className="badge">
              Year {m.year} · {m.type}
            </span>
            <h2>{m.title}</h2>
            <p className="muted">
              {m.category} · Shared by {m.uploadedBy}
            </p>
            <p className="prewrap">{m.description}</p>
            {safeLink(m.link) && (
              <a
                href={safeLink(m.link)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open material ↗
              </a>
            )}
            {teacher && (
              <div className="button-row">
                <Action
                  path={"/training/" + m._id}
                  confirmMessage="Delete this material?"
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
