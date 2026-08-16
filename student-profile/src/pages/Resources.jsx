import student from "../data/student";
import ResourceCard from "../components/cards/ResourceCard";
import PageHeader from "../components/common/PageHeader";

function Resources() {
    return (
        <>
            <PageHeader
                title="📚 My Resources"
                subtitle="Here are all the learning resources for your placement preparation."
            />

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(380px, 1fr))",
                    gap: "25px",
                }}
            >
                {student.resources.map((resource) => (
                    <ResourceCard
                        key={resource.id}
                        resource={resource}
                    />
                ))}
            </div>
        </>
    );
}

export default Resources;