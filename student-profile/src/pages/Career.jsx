import CareerSuggestions from "./CareerSuggestions";
import { useQuery, useSession } from "../state";
import { Heading, Status, Empty, Metric } from "../components";
import { DriveList } from "./Placements";
import { date } from "../api";
export default function Career() {
  const { session } = useSession();
  const profile = useQuery("/student/profile");
  const guidance = useQuery(
    "/guidance/" + encodeURIComponent(session.account.prn),
  );
  const s = profile.data;
  return (
    <>
      <Heading
        title="Career & placement"
        subtitle="Your progress and next opportunities, updated live."
      />
      <Status query={profile} />
      {s && (
        <>
          <CareerSuggestions skills={s.skills} />
          <div className="metrics">
            <Metric label="Readiness score / 100" value={s.placementScore} />
            <Metric label="Aptitude / 100" value={s.aptitudeScore} />
            <Metric label="Communication / 100" value={s.communicationScore} />
          </div>
          <div className="card section">
            <h2>{s.placementStatus}</h2>
            <div className="tags">
              {s.skills.length ? (
                s.skills.map((x) => (
                  <span className="badge" key={x}>
                    {x}
                  </span>
                ))
              ) : (
                <p>No skills added yet.</p>
              )}
            </div>
            <details>
              <summary>How is readiness calculated?</summary>
              <p>
                CGPA: 25 points. Up to 5 skills: 20. Up to 3 projects: 15. Up to
                2 internships: 15. Uploaded resume: 10. Aptitude: 10.
                Communication: 5.
              </p>
              <p className="muted">
                This is a project-defined preparation indicator, not a
                prediction of getting placed. Academic and internship details
                are self-reported; assessment scores are teacher-entered.
              </p>
            </details>
          </div>
        </>
      )}
      <h2>Upcoming placement drives</h2>
      <DriveList />
      <h2 className="section">Teacher guidance</h2>
      <Status query={guidance} />
      {!guidance.loading && !guidance.error && !guidance.data?.length && (
        <Empty>No guidance yet.</Empty>
      )}
      <div className="grid">
        {guidance.data?.map((g) => (
          <article className="card" key={g._id}>
            <span className="badge">{g.category}</span>
            <h3>{g.title}</h3>
            <p className="prewrap">{g.message}</p>
            <small className="muted">{date(g.createdAt)}</small>
          </article>
        ))}
      </div>
    </>
  );
}
