import student from "../data/student";

function Profile() {
    return (
        <div>
            <h1>Student Profile</h1>

            <hr />

            <h2>{student.name}</h2>

            <p><strong>PRN:</strong> {student.prn}</p>

            <p><strong>Department:</strong> {student.department}</p>

            <p><strong>Year:</strong> {student.year}</p>

            <p><strong>CGPA:</strong> {student.cgpa}</p>

            <p><strong>Interest Domain:</strong> {student.interestDomain}</p>

            <p><strong>Performance:</strong> {student.performance}</p>

            <hr />

            <h2>💻 Skills</h2>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "10px",
                }}
            >
                {student.skills.map((skill, index) => (
                    <span
                        key={index}
                        style={{
                            backgroundColor: "#2563eb",
                            color: "white",
                            padding: "8px 15px",
                            borderRadius: "20px",
                            fontWeight: "bold",
                        }}
                    >
                        {skill.name}
                    </span>
                ))}
            </div>
            <hr />

            <h2>📂 Projects</h2>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    marginTop: "20px",
                }}
            >
                {student.projects.map((project, index) => (
                    <div
                        key={index}
                        style={{
                            background: "#1f2937",
                            padding: "20px",
                            borderRadius: "12px",
                            border: "1px solid #374151",
                        }}
                    >
                        <h3>{project.name}</h3>

                        <p>
                            <strong>Tech Stack:</strong> {project.techStack}
                        </p>
                    </div>
                ))}
            </div>
        </div>

    );
}

export default Profile;