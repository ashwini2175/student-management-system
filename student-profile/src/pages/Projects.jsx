import { useState } from "react";
import { api, safeLink } from "../api";
import { useQuery, useSession } from "../state";
import { Form, Heading, Status, Empty, Action, field } from "../components";
export default function Projects() {
  const q = useQuery("/student/projects");
  const { refresh } = useSession();
  const [editing, setEditing] = useState(null),
    [show, setShow] = useState(false);
  return (
    <>
      <Heading
        title="Your projects"
        subtitle="Build a portfolio that shows your work."
      >
        <button
          onClick={() => {
            setEditing(null);
            setShow(!show);
          }}
        >
          {show ? "Close form" : "+ Add project"}
        </button>
      </Heading>
      {show && (
        <Form
          key={editing?._id || "new"}
          initial={
            editing
              ? { ...editing, technologies: editing.technologies.join(", ") }
              : {}
          }
          fields={[
            field("title", "Project name"),
            field("githubLink", "GitHub repository", "url"),
            field("description", "Description", "textarea", {
              required: false,
            }),
            field("technologies", "Technologies (comma separated)", "text", {
              required: false,
            }),
            field("status", "Status", "select", {
              options: ["Ongoing", "Completed"],
            }),
          ]}
          submit={(v) =>
            api("/student/projects" + (editing ? "/" + editing._id : ""), {
              method: editing ? "PUT" : "POST",
              body: {
                ...v,
                technologies: (v.technologies || "")
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean),
              },
            })
          }
          onSuccess={() => {
            setShow(false);
            setEditing(null);
            refresh();
          }}
        />
      )}
      <Status query={q} />
      {q.data?.projects.length === 0 && (
        <Empty>No projects yet. Add your first repository.</Empty>
      )}
      <div className="grid section">
        {q.data?.projects.map((p) => (
          <article className="card" key={p._id}>
            <span className="badge">{p.status}</span>
            <h2>{p.title}</h2>
            <p className="prewrap">{p.description}</p>
            <p className="muted">{p.technologies.join(" · ")}</p>
            {safeLink(p.githubLink) && (
              <a
                href={safeLink(p.githubLink)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open repository ↗
              </a>
            )}
            <div className="button-row">
              <button
                className="secondary"
                onClick={() => {
                  setEditing(p);
                  setShow(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Edit
              </button>
              <Action
                path={"/student/projects/" + p._id}
                confirmMessage="Delete this project?"
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
