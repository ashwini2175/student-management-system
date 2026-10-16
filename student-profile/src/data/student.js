const student = {
    name: "Rohit Vasave",
    prn: "2324000845",
    department: "Computer Science & Engineering",
    year: "Final Year",
    cgpa: 8.75,

    interestDomain: "Frontend Development",

    performance: "High",
    careerScore: 82,

    progress: {
        cgpa: 8.75,
        skills: 70,
        projects: 65,
        certificates: 80,
        internships: 40,
    },

    // =========================
    // SKILLS
    // =========================

    skills: [
        { name: "HTML" },
        { name: "CSS" },
        { name: "JavaScript" },
        { name: "React" },
        { name: "Git" },
        { name: "Responsive Design" },
    ],

    // =========================
    // PROJECTS
    // =========================

    projects: [
        {
            id: 1,
            title: "Student Career Portal",

            description:
                "A portal that helps students track academics, projects, internships, certificates and placement preparation.",

            technologies: [
                "React",
                "Node.js",
                "Express",
                "MongoDB",
            ],

            status: "Ongoing",

            features: [
                "Student Login",
                "Teacher Dashboard",
                "Search by PRN",
                "Placement Analytics",
            ],

            challenges: [
                "Creating reusable React components",
                "Managing React Router",
                "Designing responsive layouts",
            ],

            futureScope: [
                "AI Career Recommendation",
                "Resume Analyzer",
                "Placement Prediction",
            ],
        },
    ],

    // =========================
    // CERTIFICATES
    // =========================

    certificates: [
        {
            id: 1,
            title: "React Certification",
            issuer: "Udemy",
            year: 2026,
        },
        {
            id: 2,
            title: "JavaScript Essentials",
            issuer: "Coursera",
            year: 2025,
        },
    ],

    // =========================
    // INTERNSHIPS
    // =========================

    internships: [
        {
            id: 1,
            company: "ABC Technologies",
            role: "Frontend Intern",
            duration: "2 Months",
        },
    ],

    // =========================
    // RESOURCES
    // =========================

    resources: [
        {
            id: 1,
            title: "React Roadmap",
            category: "Frontend",
            description:
                "Complete roadmap to become a React Developer.",
        },
        {
            id: 2,
            title: "DSA Sheet",
            category: "Placement",
            description:
                "Top coding interview questions.",
        },
        {
            id: 3,
            title: "Resume Guide",
            category: "Career",
            description:
                "How to build an ATS-friendly resume.",
        },
    ],
};

export default student;