import { api } from "../api";
import { useQuery, useSession } from "../state";
import {
  Form,
  Heading,
  Status,
  Empty,
  FileButton,
  Action,
  field,
} from "../components";
export default function Certificates() {
  const q = useQuery("/student/certificates");
  const { refresh } = useSession();
  return (
    <>
      <Heading
        title="Certificates"
        subtitle="Keep evidence of your learning in one place."
      />
      <details className="section">
        <summary>Add a certificate</summary>
        <Form
          fields={[
            field("title", "Title"),
            field("issuer", "Issuer"),
            field("year", "Year", "number", { min: 1950, max: 2100 }),
            field("certificate", "Certificate PDF · up to 10 MB", "file", {
              accept: ".pdf",
            }),
          ]}
          submit={(v) => {
            const f = new FormData();
            Object.entries(v).forEach(([k, x]) => f.append(k, x));
            return api("/student/certificates", { method: "POST", body: f });
          }}
          onSuccess={refresh}
        />
      </details>
      <Status query={q} />
      {q.data?.certificates.length === 0 && (
        <Empty>No certificates uploaded.</Empty>
      )}
      <div className="grid">
        {q.data?.certificates.map((c) => (
          <article className="card" key={c._id}>
            <span className="badge">{c.year}</span>
            <h2>{c.title}</h2>
            <p className="muted">{c.issuer}</p>
            <div className="button-row">
              <FileButton path={c.fileUrl} name={c.fileName} />
              <Action
                path={"/student/certificates/" + c._id}
                confirmMessage="Delete this certificate?"
              >
                Delete
              </Action>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
