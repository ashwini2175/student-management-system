import { parseSkills } from '../utils/parseSkills';
const paths = [
 ['Frontend Developer','Web development',['HTML','CSS','JavaScript','React','Git'],'Build a responsive job board with forms and filters.'],
 ['Backend Developer','Web development',['JavaScript','Node.js','Express','SQL','Git'],'Build an authenticated task API with database persistence.'],
 ['Full Stack Developer','Web development',['HTML','CSS','JavaScript','React','Node.js','Express','MongoDB','Git'],'Build a placement portal with tested role-based CRUD.'],
 ['Data Analyst','Data analytics',['Excel','SQL','Statistics','Power BI','Python'],'Clean a sales dataset and explain three dashboard findings.'],
 ['Java Developer','Software development',['Java','OOP','DSA','SQL','Spring Boot','Git'],'Build a library API with SQL and automated tests.'],
 ['QA Automation Trainee','Testing',['Testing','JavaScript','Playwright','SQL','Git'],'Test registration, invalid login and project CRUD.'],
 ['UI/UX Design Trainee','Design',['Figma','Wireframing','Prototyping','User Research','Accessibility'],'Interview students and prototype an accessible dashboard.'],
 ['Embedded Systems Trainee','Electronics',['C','C++','Microcontrollers','Electronics','Arduino'],'Build a sensor logger and document error handling.'],
 ['Mechanical CAD Trainee','Mechanical design',['AutoCAD','SolidWorks','Engineering Drawing','GD&T'],'Model an assembly and produce dimensioned drawings.'],
 ['Civil BIM Trainee','Civil engineering',['AutoCAD','Revit','BIM','Estimation','Excel'],'Model a small building and prepare a quantity estimate.'],
];
export default function CareerSuggestions({skills=[]}) {
 let cleaned;try{cleaned=parseSkills(skills);}catch{cleaned=skills;}
 const entered=new Set(cleaned.map(s=>s.toLowerCase()));
 const roles=paths.map(([title,domain,required,project])=>{const matched=required.filter(s=>entered.has(s.toLowerCase()));return {title,domain,required,project,matched,missing:required.filter(s=>!entered.has(s.toLowerCase())),coverage:Math.round(matched.length/required.length*100)};}).filter(r=>r.matched.length).sort((a,b)=>b.coverage-a.coverage||b.matched.length-a.matched.length);
 return <section className="section"><h2>Explore roles from your skills</h2><p className="muted">Example learning paths across departments. Skill-name matches do not assess proficiency or job eligibility. These are rule-based suggestions, not AI or live vacancies.</p><details className="card"><summary>How are suggestions ranked?</summary><p>Matched skills divided by listed skills × 100. Duplicate skills count once. Coverage is separate from placement readiness.</p></details>{roles.length?<div className="grid section">{roles.slice(0,4).map(r=><article className="card" key={r.title}><span className="badge">{r.domain}</span><h3>{r.title}</h3><strong>{r.matched.length} of {r.required.length} skills · {r.coverage}% coverage</strong><p>Matching skills: {r.matched.join(', ')}</p><p>Skills to explore: {r.missing.join(', ')||'Demonstrate these skills in a practical project.'}</p><p>Practice project: {r.project}</p></article>)}</div>:<p className="card">{skills.length?'No catalogue match yet. Ask your teacher about paths in your field.':'Add skills in Profile to explore learning paths.'}</p>}</section>;
}
