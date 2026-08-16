import { useParams } from "react-router-dom";
import student from "../data/student";

function ProjectDetails() {
    const navigate = useNavigate();

    const { id } = useParams();

    const project = student.projects.find(
        p => p.id === Number(id)
    );
    return (
        <button
            onClick={() => navigate("/projects")}
            style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                marginBottom: "25px",
            }}
        >

        </button>
    );
}

export default ProjectDetails;