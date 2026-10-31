import { api, date } from "../api";
import { useQuery, useSession } from "../state";
import { Form, Heading, Status, Empty, field } from "../components";
export default function Guidance() {
  const q = useQuery("/guidance");
  const { refresh } = useSession();
  return (
    <>
      <Heading
        title="Student guidance"
        subtitle="Send specific, actionable advice to a student."
      />
      <Form
        fields={[
          field("studentPRN", "Student PRN"),
          field("title", "Title"),
          field("category", "Category", "select", {
            options: ["Career", "Academic", "Placement", "Project"],
          }),
          field("message", "Message", "textarea"),
        ]}
        submit={(v) => api("/guidance", { method: "POST", body: v })}
        onSuccess={refresh}
      />
      <h2>Sent guidance</h2>
      <Status query={q} />
      {!q.loading && !q.error && !q.data?.length && (
        <Empty>No guidance sent yet.</Empty>
      )}
      <div className="grid">
        {q.data?.map((g) => (
          <article className="card" key={g._id}>
            <span className="badge">
              {g.studentPRN} · {g.category}
            </span>
            <h3>{g.title}</h3>
            <p className="prewrap">{g.message}</p>
            <small className="muted">{date(g.createdAt)}</small>
          </article>
        ))}
      </div>
    </>
  );
}
