import { Link } from "react-router-dom";
import { useSession, useQuery } from "../state";
import { Heading, Metric, Status, Empty } from "../components";
import { date, today } from "../api";
export default function Dashboard() {
  const { session } = useSession();
  const teacher = session.role === "Teacher";
  const q = useQuery(teacher ? "/student" : "/student/profile");
  const placements = useQuery("/placement");
  const upcoming = (placements.data || []).filter(
    (p) => p.driveDate >= today(),
  );
  return (
    <>
      <Heading
        title={`Welcome, ${session.account.name.split(" ")[0]}`}
        subtitle={
          teacher
            ? "A clear view of student progress and opportunities."
            : "Your progress, opportunities and next steps in one place."
        }
      />
      <section className="dashboard-banner">
        <div><span className="banner-kicker">ONE STEP FORWARD, EVERY DAY</span><h2>{teacher ? "Help your students find their next opportunity." : "Build your skills. Shape your next chapter."}</h2><p>{teacher ? "Review progress, share guidance and bring opportunities to your classroom." : "Keep your portfolio up to date and explore guidance from your teachers."}</p></div>
        <Link className="banner-button" to={teacher ? "/students" : "/profile"}>{teacher ? "Explore students" : "Update my profile"} →</Link>
      </section>
      <Status query={q} />
      {q.data && (
        <div className="metrics">
          {teacher ? (
            <>
              <Metric label="Total students" value={q.data.length} />
              <Metric
                label="Placement ready"
                value={
                  q.data.filter((s) => s.placementStatus === "Placement Ready")
                    .length
                }
              />
              <Metric
                label="Needs guidance"
                value={
                  q.data.filter((s) => s.placementStatus !== "Placement Ready")
                    .length
                }
              />
            </>
          ) : (
            <>
              <Metric
                label="Readiness score / 100"
                value={q.data.placementScore}
              />
              <Metric label="Projects" value={q.data.projects.length} />
              <Metric label="Certificates" value={q.data.certificates.length} />
            </>
          )}
          <Metric
            label="Upcoming drives"
            value={
              placements.loading
                ? "…"
                : placements.error
                  ? "—"
                  : upcoming.length
            }
          />
        </div>
      )}
      <section className="section-title">
        <h2>Your workspace</h2>
      </section>
      <div className="grid">
        {(teacher
          ? [
              [
                "students",
                "Student directory",
                "Search profiles and update assessment scores.",
              ],
              [
                "guidance",
                "Send guidance",
                "Give a student a practical next step.",
              ],
              [
                "placements",
                "Placement drives",
                "Publish an opportunity and notify eligible students.",
              ],
              [
                "training",
                "Learning materials",
                "Share year-specific preparation resources.",
              ],
            ]
          : [
              [
                "profile",
                "Your profile",
                "Keep your skills, resume and academic details current.",
              ],
              ["projects", "Your projects", "Show what you have built."],
              [
                "career",
                "Career & guidance",
                "Explore drives and your teacher’s guidance.",
              ],
              [
                "training",
                "Learning materials",
                "Preparation selected for your year.",
              ],
            ]
        ).map(([path, title, desc]) => (
          <Link className="card action-card" key={path} to={"/" + path}>
            <h3>
              {title} <span>↗</span>
            </h3>
            <p className="muted">{desc}</p>
          </Link>
        ))}
      </div>
      <section className="section-title">
        <h2>Upcoming opportunities</h2>
        <Link to={teacher ? "/placements" : "/career"}>View all →</Link>
      </section>
      <Status query={placements} />
      {!placements.loading && !placements.error && !upcoming.length && (
        <Empty>No upcoming drives yet.</Empty>
      )}
      <div className="grid">
        {upcoming.slice(0, 4).map((p) => (
          <article className="card" key={p._id}>
            <span className="badge">{date(p.driveDate)}</span>
            <h3>{p.company}</h3>
            <p>{p.role}</p>
            <p className="muted">
              CGPA {p.eligibilityCGPA}+ · {p.package} · {p.location}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}
