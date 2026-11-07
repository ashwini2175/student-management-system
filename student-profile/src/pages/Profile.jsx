import {parseSkills} from "../utils/parseSkills";
import { useEffect, useState } from "react";
import { api, API } from "../api";
import { useQuery, useSession } from "../state";
import {
  Form,
  Heading,
  Status,
  FileButton,
  Action,
  field,
} from "../components";
function Photo({ path }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    if (!path) return;
    let active = true,
      object;
    fetch(API + path, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.blob();
      })
      .then((b) => {
        object = URL.createObjectURL(b);
        if (active) setSrc(object);
        else URL.revokeObjectURL(object);
      })
      .catch(() => {});
    return () => {
      active = false;
      if (object) URL.revokeObjectURL(object);
    };
  }, [path]);
  return src ? (
    <img className="avatar" src={src} alt="Your profile" />
  ) : (
    <div className="avatar placeholder">◈</div>
  );
}
export default function Profile() {
  const q = useQuery("/student/profile");
  const { refresh } = useSession();
  const s = q.data;
  return (
    <>
      <Heading
        title="Your profile"
        subtitle="Your academic and portfolio details. Assessment scores are entered by a teacher."
      />
      <Status query={q} />
      {s && (
        <>
          <div className="card profile-summary">
            <Photo path={s.profilePhoto} />
            <div>
              <h2>{s.name}</h2>
              <p className="muted">
                {s.prn} · {s.department} · Year {s.year}
              </p>
              <span className="badge">
                {s.placementStatus} · {s.placementScore}/100
              </span>
            </div>
          </div>
          <Form
            key={s.updatedAt}
            initial={{ ...s, skills: s.skills.join(", ") }}
            fields={[
              field("name", "Full name"),
              field("email", "Email", "email"),
              field("department", "Department"),
              field("year", "Year", "select", { options: [1, 2, 3, 4] }),
              field("cgpa", "CGPA", "number", { min: 0, max: 10, step: 0.01 }),
              field("skills", "Skills (one per line or comma separated)", "textarea", {
                required: false,
              }),
              field("interestDomain", "Interest domain", "text", {
                required: false,
              }),
              field("internshipCount", "Completed internships", "number", {
                min: 0,
                max: 50,
              }),
            ]}
            submit={(v) =>
              api("/student/profile", {
                method: "PUT",
                body: {
                  ...v,
                  skills: parseSkills(v.skills || ""),
                },
              })
            }
            onSuccess={refresh}
          />
          <div className="grid section">
            <section>
              <h2>Profile photo</h2>
              <Form
                fields={[
                  field(
                    "profilePhoto",
                    "JPG, PNG or WebP · up to 5 MB",
                    "file",
                    { accept: "image/png,image/jpeg,image/webp" },
                  ),
                ]}
                submit={(v) => {
                  const f = new FormData();
                  f.append("profilePhoto", v.profilePhoto);
                  return api("/student/profile/photo", {
                    method: "PUT",
                    body: f,
                  });
                }}
                onSuccess={refresh}
              />
            </section>
            <section>
              <h2>Resume</h2>
              {s.resumeUrl && (
                <div className="button-row">
                  <FileButton path={s.resumeUrl} name="resume.pdf" />
                  <Action
                    path="/student/profile/resume"
                    confirmMessage="Remove your resume?"
                  >
                    Remove resume
                  </Action>
                </div>
              )}
              <Form
                fields={[
                  field("resume", "PDF · up to 10 MB", "file", {
                    accept: ".pdf",
                  }),
                ]}
                submit={(v) => {
                  const f = new FormData();
                  f.append("resume", v.resume);
                  return api("/student/profile/resume", {
                    method: "PUT",
                    body: f,
                  });
                }}
                onSuccess={refresh}
              />
            </section>
          </div>
        </>
      )}
    </>
  );
}
