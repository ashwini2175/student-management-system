const Student = require("../models/Student");
const { wrap, text, number, url, fail, safe } = require("../utils/http");
const { email } = require("./authController");
const { publish } = require("../utils/events");
const files = require("../middleware/uploads");
const fields = [
  "name",
  "email",
  "department",
  "year",
  "cgpa",
  "skills",
  "interestDomain",
  "internshipCount",
];
const profileInput = (b) => {
  const out = {};
  for (const key of fields)
    if (b[key] !== undefined) {
      if (key === "email") out[key] = email(b[key]);
      else if (["year", "cgpa", "internshipCount"].includes(key)) {
        out[key] = number(
          b[key],
          key,
          key === "year" ? 1 : 0,
          key === "year" ? 4 : key === "cgpa" ? 10 : 50,
        );
        if (key !== "cgpa" && !Number.isInteger(out[key]))
          throw fail(400, `${key} must be an integer.`);
      } else if (key === "skills") {
        if (!Array.isArray(b.skills) || b.skills.length > 30)
          throw fail(400, "Provide up to 30 skills.");
        out.skills = [...new Set(b.skills.map((s) => text(s, "Skill", 60)))];
      } else
        out[key] =
          key === "interestDomain" && b[key] === "" ? "" : text(b[key], key);
    }
  return out;
};
const save = async (s) => {
  await s.save();
  publish("student", s.prn);
};
exports.getStudentProfile = wrap(async (req, res) =>
  res.json(safe(req.account)),
);
exports.updateStudentProfile = wrap(async (req, res) => {
  const updates = profileInput(req.body);
  Object.assign(req.account, updates);
  await save(req.account);
  res.json({ student: safe(req.account), message: "Profile updated." });
});
exports.getAllStudents = wrap(async (req, res) =>
  res.json(await Student.find().select("-password").sort({ name: 1 })),
);
exports.getStudentByPrn = wrap(async (req, res) => {
  const s = await Student.findOne({ prn: req.params.prn }).select("-password");
  if (!s) throw fail(404, "Student not found.");
  res.json(s);
});
exports.updateScores = wrap(async (req, res) => {
  const s = await Student.findOne({ prn: req.params.prn });
  if (!s) throw fail(404, "Student not found.");
  s.aptitudeScore = number(req.body.aptitudeScore, "Aptitude", 0, 100);
  s.communicationScore = number(
    req.body.communicationScore,
    "Communication",
    0,
    100,
  );
  await save(s);
  res.json({ student: safe(s) });
});
const projectInput = (b) => {
  const link = url(b.githubLink, "GitHub repository");
  const u = new URL(link);
  if (
    u.protocol !== "https:" ||
    u.hostname !== "github.com" ||
    u.pathname.split("/").filter(Boolean).length !== 2
  )
    throw fail(400, "Enter an HTTPS GitHub repository URL.");
  return {
    title: text(b.title, "Project title"),
    githubLink: link,
    description:
      typeof b.description === "string"
        ? b.description.trim().slice(0, 5000)
        : "",
    technologies: Array.isArray(b.technologies)
      ? b.technologies.slice(0, 30).map((s) => text(s, "Technology", 60))
      : [],
    status: ["Ongoing", "Completed"].includes(b.status) ? b.status : "Ongoing",
  };
};
exports.getStudentProjects = wrap(async (req, res) =>
  res.json({ projects: req.account.projects }),
);
exports.addProject = wrap(async (req, res) => {
  req.account.projects.push(projectInput(req.body));
  await save(req.account);
  res.status(201).json({ project: req.account.projects.at(-1) });
});
exports.updateProject = wrap(async (req, res) => {
  const p = req.account.projects.id(req.params.id);
  if (!p) throw fail(404, "Project not found.");
  Object.assign(p, projectInput(req.body));
  await save(req.account);
  res.json({ project: p });
});
exports.deleteProject = wrap(async (req, res) => {
  const p = req.account.projects.id(req.params.id);
  if (!p) throw fail(404, "Project not found.");
  p.deleteOne();
  await save(req.account);
  res.json({ message: "Project deleted." });
});
exports.getStudentCertificates = wrap(async (req, res) =>
  res.json({ certificates: req.account.certificates }),
);
exports.addStudentCertificate = wrap(async (req, res) => {
  const b = req.body;
  const cert = {
    title: text(b.title, "Title"),
    issuer: text(b.issuer, "Issuer"),
    year: number(b.year, "Year", 1950, 2100),
  };
  if (!Number.isInteger(cert.year)) throw fail(400, "Year must be an integer.");
  cert.fileUrl = await files.persist(req.file, "certificates");
  cert.fileName = req.file.originalname;
  try {
    req.account.certificates.push(cert);
    await save(req.account);
  } catch (e) {
    await files.remove(cert.fileUrl);
    throw e;
  }
  res.status(201).json({ certificate: req.account.certificates.at(-1) });
});
exports.deleteCertificate = wrap(async (req, res) => {
  const c = req.account.certificates.id(req.params.id);
  if (!c) throw fail(404, "Certificate not found.");
  const old = c.fileUrl;
  c.deleteOne();
  await save(req.account);
  await files.remove(old);
  res.json({ message: "Certificate deleted." });
});
exports.uploadFile = (kind) =>
  wrap(async (req, res) => {
    const key = kind === "photo" ? "profilePhoto" : "resumeUrl";
    const old = req.account[key];
    const path = await files.persist(req.file, kind);
    req.account[key] = path;
    if (kind === "resume") req.account.resumeUploaded = true;
    try {
      await save(req.account);
    } catch (e) {
      await files.remove(path);
      throw e;
    }
    await files.remove(old);
    res.json({ student: safe(req.account) });
  });
exports.removeResume = wrap(async (req, res) => {
  const old = req.account.resumeUrl;
  req.account.resumeUrl = "";
  req.account.resumeUploaded = false;
  await save(req.account);
  await files.remove(old);
  res.json({ student: safe(req.account) });
});
