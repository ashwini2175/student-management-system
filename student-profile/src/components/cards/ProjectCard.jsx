
import { useNavigate } from "react-router-dom";
function ProjectCard({ project }) {
    const navigate = useNavigate();
    navigate(`/projects/${project.id}`)
    return (
        <div
            style={{
                background: "theme.colors.card",
                color: "theme.colors.text",
                borderRadius: "15px",
                padding: "25px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
        >
            <h2>{project.title}</h2>

            <p
                style={{
                    marginTop: "10px",
                    color: "#d1d5db",
                }}
            >
                {project.description}
            </p>

            <h4 style={{ marginTop: "20px" }}>
                Technologies
            </h4>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "10px",
                }}
            >
                {project.technologies.map((tech, index) => (
                    <span
                        key={index}
                        style={{
                            background: "theme.colors.card",
                            padding: "8px 15px",
                            borderRadius: "20px",
                            fontSize: "14px",
                        }}
                    >
                        {tech}
                    </span>
                ))}
            </div>

            <h4
                style={{
                    marginTop: "20px",
                    color:
                        project.status === "Completed"
                            ? "#22c55e"
                            : "#facc15",
                }}
            >
                {project.status}
            </h4>

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "20px",
                }}
            >

            </div>
        </div>
    );
}

export default ProjectCard;