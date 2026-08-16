import student from "../data/student";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import theme from "../styles/theme";

function Projects() {
    return (
        <>
            <PageHeader
                title="📂 My Projects"
                subtitle="Manage all your academic and personal projects."
            />

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                    gap: "20px",
                }}
            >
                {student.projects.map((project) => (
                    <Card key={project.id}>
                        <h2
                            style={{
                                color: theme.colors.text,
                                marginBottom: "10px",
                            }}
                        >
                            {project.title}
                        </h2>

                        <p
                            style={{
                                color: theme.colors.textSecondary,
                                lineHeight: "1.7",
                            }}
                        >
                            {project.description}
                        </p>

                        <h4
                            style={{
                                marginTop: "20px",
                                color: theme.colors.primary,
                            }}
                        >
                            Technologies
                        </h4>

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap",
                            }}
                        >
                            {project.technologies.map((tech) => (
                                <span
                                    key={tech}
                                    style={{
                                        background: theme.colors.primary,
                                        color: "theme.colors.card",
                                        padding: "6px 12px",
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
                                color: theme.colors.primary,
                            }}
                        >
                            Status
                        </h4>

                        <p
                            style={{
                                color:
                                    project.status === "Completed"
                                        ? theme.colors.success
                                        : theme.colors.warning,
                                fontWeight: "bold",
                            }}
                        >
                            {project.status}
                        </p>
                    </Card>
                ))}
            </div>
        </>
    );
}

export default Projects;