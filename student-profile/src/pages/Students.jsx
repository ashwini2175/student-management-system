import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, safeLink } from "../api";
import { useQuery, useSession } from "../state";
import { Form, Heading, Status, Empty, FileButton, field } from "../components";
export default function Students() {
  const q = useQuery("/student");
  const [search, setSearch] = useState(""),
    [minimum, setMinimum] = useState(""),
    [status, setStatus] = useState("");
  const students = (q.data || []).filter(
    (s) =>
      `${s.name} ${s.prn} ${s.department}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      s.cgpa >= Number(minimum) &&
      (!status || s.placementStatus === status),
  );
  return (
    <>
      <Heading
        title="Student directory"
        subtitle="Search profiles, identify needs and review portfolios."
      />
      <div className="card filters">
        <label>
          Search name, PRN or department
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students…"
          />
        </label>
        <label>
          Minimum CGPA
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={minimum}
            onChange={(e) => setMinimum(e.target.value)}
          />
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All students</option>
            {["Placement Ready", "Needs Guidance", "Immediate Attention"].map(
              (s) => (
                <option key={s}>{s}</option>
              ),
            )}
          </select>
        </label>
      </div>
      <Status query={q} />
      {!q.loading && !q.error && !students.length && (
        <Empty>No matching students.</Empty>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Department</th>
              <th>CGPA</th>
              <th>Readiness</th>
              <th>Profile</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>
                  <strong>{s.name}</strong>
                  <small>{s.prn}</small>
                </td>
                <td>
                  {s.department} · Year {s.year}
                </td>
                <td>{s.cgpa}</td>
                <td>
                  {s.placementScore}/100
                  <br />
                  <small>{s.placementStatus}</small>
                </td>
                <td>
                  <Link to={"/students/" + encodeURIComponent(s.prn)}>
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export function StudentDetail() {
  const { prn } = useParams();
  const q = useQuery("/student/" + encodeURIComponent(prn));
  const { refresh } = useSession();
  const s = q.data;
  return (
    <>
      <Link to="/students">← Student directory</Link>
      <Status query={q} />
      {s && (
        <>
          <Heading
            title={s.name}
            subtitle={`${s.prn} · ${s.department} · Year ${s.year}`}
          />
          <div className="card">
            <p>{s.email}</p>
            <p>
              CGPA: {s.cgpa} · Internships: {s.internshipCount}
            </p>
            <p>Skills: {s.skills.join(", ") || "None added"}</p>
            <p>
              {s.placementStatus} · {s.placementScore}/100
            </p>
            {s.resumeUrl && (
              <FileButton path={s.resumeUrl} name={s.prn + "-resume.pdf"} />
            )}
          </div>
          <h2>Assessment scores</h2>
          <Form
            key={s.updatedAt}
            initial={{
              aptitudeScore: s.aptitudeScore,
              communicationScore: s.communicationScore,
            }}
            fields={[
              field("aptitudeScore", "Aptitude / 100", "number", {
                min: 0,
                max: 100,
              }),
              field("communicationScore", "Communication / 100", "number", {
                min: 0,
                max: 100,
              }),
            ]}
            submit={(v) =>
              api("/student/" + encodeURIComponent(prn) + "/scores", {
                method: "PUT",
                body: v,
              })
            }
            onSuccess={refresh}
          />
          <h2>Projects</h2>
          <div className="grid">
            {s.projects.map((p) => (
              <article className="card" key={p._id}>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                {safeLink(p.githubLink) && (
                  <a
                    href={safeLink(p.githubLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Repository ↗
                  </a>
                )}
              </article>
            ))}
          </div>
          <h2>Certificates</h2>
          <div className="grid">
            {s.certificates.map((c) => (
              <article className="card" key={c._id}>
                <h3>{c.title}</h3>
                <p>
                  {c.issuer} · {c.year}
                </p>
                <FileButton path={c.fileUrl} name={c.fileName} />
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
