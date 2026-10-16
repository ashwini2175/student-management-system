import { useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import theme from "../styles/theme";

const API_URL = "http://localhost:5000/student/projects";
const emptyForm = { title: "", githubLink: "" };

async function projectsRequest(path = "", options = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please log in again.");
    }

    let response;

    try {
        response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(options.body
                    ? { "Content-Type": "application/json" }
                    : {}),
            },
        });
    } catch {
        throw new Error(
            "Cannot connect to the backend. Check that it is running on port 5000."
        );
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ||
            (response.status === 401
                ? "Your session has expired. Please log in again."
                : "Request failed. Please try again.")
        );
    }

    return data;
}

function validateProject(formData) {
    const title = formData.title.trim();
    const githubLink = formData.githubLink.trim();

    if (!title) {
        throw new Error("Please enter a project name.");
    }

    let url;

    try {
        url = new URL(githubLink);
    } catch {
        throw new Error("Please enter a valid GitHub repository URL.");
    }

    const pathParts = url.pathname.split("/").filter(Boolean);

    if (
        url.protocol !== "https:" ||
        url.hostname !== "github.com" ||
        url.username ||
        url.password ||
        pathParts.length !== 2
    ) {
        throw new Error(
            "Use a repository URL like https://github.com/username/repository"
        );
    }

    return { title, githubLink };
}

function safeGithubLink(value) {
    try {
        const url = new URL(value);

        return url.protocol === "https:" &&
            url.hostname === "github.com" &&
            !url.username &&
            !url.password
            ? url.href
            : null;
    } catch {
        return null;
    }
}

function Projects() {
    const [projects, setProjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [formData, setFormData] = useState({ ...emptyForm });

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    const busy = saving || deletingId !== null;

    // Load the logged-in student's projects.
    useEffect(() => {
        let active = true;

        async function loadProjects() {
            setLoading(true);
            setLoadError("");

            try {
                const data = await projectsRequest();

                if (!Array.isArray(data?.projects)) {
                    throw new Error("The server returned an invalid project list.");
                }

                if (active) {
                    setProjects(data.projects);
                }
            } catch (requestError) {
                if (active) {
                    setLoadError(requestError.message);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadProjects();

        return () => {
            active = false;
        };
    }, [reloadKey]);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function resetForm() {
        setFormData({ ...emptyForm });
        setEditingProjectId(null);
        setShowForm(false);
    }

    function handleToggleForm() {
        setError("");
        setSuccess("");

        if (showForm) {
            resetForm();
        } else {
            setFormData({ ...emptyForm });
            setEditingProjectId(null);
            setShowForm(true);
        }
    }

    function handleEdit(project) {
        if (!project._id) {
            setError("This project has no ID. Reload the page and try again.");
            return;
        }

        setError("");
        setSuccess("");
        setEditingProjectId(project._id);
        setFormData({
            title: project.title || "",
            githubLink: project.githubLink || "",
        });
        setShowForm(true);

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // One handler handles both adding and updating.
    async function handleSave(event) {
        event.preventDefault();

        if (busy) return;

        setError("");
        setSuccess("");

        let payload;

        try {
            payload = validateProject(formData);
        } catch (validationError) {
            setError(validationError.message);
            return;
        }

        const isEditing = editingProjectId !== null;
        setSaving(true);

        try {
            const data = await projectsRequest(
                isEditing
                    ? `/${encodeURIComponent(editingProjectId)}`
                    : "",
                {
                    method: isEditing ? "PUT" : "POST",
                    body: JSON.stringify(payload),
                }
            );

            if (!data?.project?._id) {
                setReloadKey((previous) => previous + 1);
                resetForm();

                throw new Error(
                    "The server responded without a project record. Reloading the list to check the result."
                );
            }

            setProjects((previous) =>
                isEditing
                    ? previous.map((project) =>
                        project._id === editingProjectId
                            ? data.project
                            : project
                    )
                    : [...previous, data.project]
            );

            resetForm();
            setSuccess(
                isEditing
                    ? "Project updated successfully."
                    : "Project added successfully."
            );
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(project) {
        if (busy) return;

        if (!project._id) {
            setError("This project has no ID. Reload the page and try again.");
            return;
        }

        const confirmed = window.confirm(
            `Delete "${project.title}"? This cannot be undone.`
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");
        setDeletingId(project._id);

        try {
            await projectsRequest(
                `/${encodeURIComponent(project._id)}`,
                { method: "DELETE" }
            );

            setProjects((previous) =>
                previous.filter((item) => item._id !== project._id)
            );

            if (editingProjectId === project._id) {
                resetForm();
            }

            setSuccess("Project deleted successfully.");
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div>
            <PageHeader
                title="📂 My Projects"
                subtitle="Showcase your projects and GitHub repositories."
            />

            {error && (
                <div role="alert" style={styles.error}>
                    {error}
                </div>
            )}

            {success && (
                <div role="status" style={styles.success}>
                    {success}
                </div>
            )}

            {loading ? (
                <Card>
                    <p role="status">Loading projects...</p>
                </Card>
            ) : loadError ? (
                <Card>
                    <p role="alert" style={{ color: "#991b1b" }}>
                        {loadError}
                    </p>

                    <button
                        type="button"
                        style={styles.button}
                        onClick={() =>
                            setReloadKey((previous) => previous + 1)
                        }
                    >
                        Retry
                    </button>
                </Card>
            ) : (
                <>
                    <div style={styles.toolbar}>
                        <button
                            type="button"
                            onClick={handleToggleForm}
                            disabled={busy}
                            style={{
                                ...styles.button,
                                opacity: busy ? 0.6 : 1,
                            }}
                        >
                            {showForm ? "Close Form" : "+ Add Project"}
                        </button>
                    </div>

                    {showForm && (
                        <div style={{ marginBottom: "24px" }}>
                            <Card>
                                <h2 style={styles.formTitle}>
                                    {editingProjectId
                                        ? "Edit Project"
                                        : "Add New Project"}
                                </h2>

                                <form onSubmit={handleSave}>
                                    <label
                                        htmlFor="project-title"
                                        style={styles.label}
                                    >
                                        Project Name
                                    </label>

                                    <input
                                        id="project-title"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter project name"
                                        required
                                        disabled={busy}
                                        style={styles.input}
                                    />

                                    <label
                                        htmlFor="project-github"
                                        style={styles.label}
                                    >
                                        GitHub Repository Link
                                    </label>

                                    <input
                                        id="project-github"
                                        type="url"
                                        name="githubLink"
                                        value={formData.githubLink}
                                        onChange={handleChange}
                                        placeholder="https://github.com/username/repository"
                                        required
                                        disabled={busy}
                                        style={styles.input}
                                    />

                                    <div style={styles.actions}>
                                        <button
                                            type="submit"
                                            disabled={busy}
                                            style={{
                                                ...styles.button,
                                                opacity: busy ? 0.6 : 1,
                                            }}
                                        >
                                            {saving
                                                ? "Saving..."
                                                : editingProjectId
                                                    ? "Update Project"
                                                    : "Save Project"}
                                        </button>

                                        <button
                                            type="button"
                                            disabled={busy}
                                            onClick={() => {
                                                resetForm();
                                                setError("");
                                            }}
                                            style={{
                                                ...styles.button,
                                                background: "#64748b",
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </Card>
                        </div>
                    )}

                    {projects.length === 0 ? (
                        <Card>
                            <div style={styles.empty}>
                                <div style={{ fontSize: "40px" }}>📂</div>
                                <h2>No Projects Yet</h2>
                                <p>Add your first project using the button above.</p>
                            </div>
                        </Card>
                    ) : (
                        <div style={styles.grid}>
                            {projects.map((project) => {
                                const githubUrl = safeGithubLink(
                                    project.githubLink
                                );

                                return (
                                    <Card key={project._id}>
                                        <div style={{ fontSize: "30px" }}>
                                            📁
                                        </div>

                                        <h2 style={styles.projectTitle}>
                                            {project.title}
                                        </h2>

                                        {githubUrl ? (
                                            <a
                                                href={githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={styles.link}
                                            >
                                                View GitHub Repository →
                                            </a>
                                        ) : (
                                            <p style={styles.muted}>
                                                Edit this project to add a valid
                                                GitHub link.
                                            </p>
                                        )}

                                        <div style={styles.actions}>
                                            <button
                                                type="button"
                                                disabled={busy}
                                                onClick={() =>
                                                    handleEdit(project)
                                                }
                                                style={styles.button}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                disabled={busy}
                                                onClick={() =>
                                                    handleDelete(project)
                                                }
                                                style={{
                                                    ...styles.button,
                                                    background: "#dc2626",
                                                }}
                                            >
                                                {deletingId === project._id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

const styles = {
    toolbar: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "24px",
    },
    formTitle: {
        marginTop: 0,
        marginBottom: "24px",
        color: theme.colors.text,
    },
    label: {
        display: "block",
        fontWeight: 600,
        color: theme.colors.text,
    },
    input: {
        width: "100%",
        padding: "12px",
        marginTop: "8px",
        marginBottom: "18px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        boxSizing: "border-box",
        fontSize: "15px",
    },
    button: {
        background: theme.colors.primary,
        color: "#ffffff",
        border: "none",
        padding: "11px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "14px",
    },
    actions: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
        gap: "18px",
    },
    projectTitle: {
        color: theme.colors.text,
        fontSize: "20px",
        overflowWrap: "anywhere",
    },
    link: {
        display: "inline-block",
        color: theme.colors.primary,
        fontWeight: 600,
        marginBottom: "20px",
        overflowWrap: "anywhere",
    },
    muted: {
        color: "#64748b",
        marginBottom: "20px",
    },
    empty: {
        textAlign: "center",
        padding: "30px",
        color: theme.colors.text,
    },
    error: {
        background: "#fee2e2",
        color: "#991b1b",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px",
    },
    success: {
        background: "#dcfce7",
        color: "#166534",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px",
    },
};

export default Projects;