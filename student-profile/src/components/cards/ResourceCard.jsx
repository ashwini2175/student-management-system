import { useNavigate } from "react-router-dom";

function ResourceCard({ resource }) {

    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/resources/${resource.id}`)}
            style={{
                background: "theme.colors.card",
                color: "white",
                borderRadius: "15px",
                padding: "25px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                cursor: "pointer",
            }}
        >
            <h2>{resource.title}</h2>
        </div>
    );
}

export default ResourceCard;