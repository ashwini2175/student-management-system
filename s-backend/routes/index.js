const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { teacher, student, owner } = require("../middleware/roles");
const a = require("../controllers/authController");
const s = require("../controllers/studentController");
const p = require("../controllers/placementController");
const g = require("../controllers/guidanceController");
const n = require("../controllers/notificationController");
const t = require("../controllers/trainingController");
const { upload } = require("../middleware/uploads");
const { wrap, safe } = require("../utils/http");
// Public authentication routes; account creation accepts only explicit student fields.
router.post("/student/login", a.studentLogin);
router.post("/auth/student-login", a.studentLogin);
router.post("/teacher/login", a.teacherLogin);
router.post("/student", a.register);
router.post("/auth/forgot-password", require("../controllers/passwordResetController").forgot);
router.post("/auth/reset-password", require("../controllers/passwordResetController").reset);
router.use(auth);
router.get("/auth/me", (req, res) =>
  res.json({ role: req.user.role, account: safe(req.account) }),
);
router.put("/auth/password", a.changePassword);
router.get("/events", require("../utils/events").stream);
router.get("/student", teacher, s.getAllStudents);
router.get("/student/profile", student, s.getStudentProfile);
router.put("/student/profile", student, s.updateStudentProfile);
router.put(
  "/student/profile/photo",
  student,
  upload.single("profilePhoto"),
  s.uploadFile("photo"),
);
router.put(
  "/student/profile/resume",
  student,
  upload.single("resume"),
  s.uploadFile("resume"),
);
router.delete("/student/profile/resume", student, s.removeResume);
router.get("/student/projects", student, s.getStudentProjects);
router.post("/student/projects", student, s.addProject);
router.put("/student/projects/:id", student, s.updateProject);
router.delete("/student/projects/:id", student, s.deleteProject);
router.get("/student/certificates", student, s.getStudentCertificates);
router.post(
  "/student/certificates",
  student,
  upload.single("certificate"),
  s.addStudentCertificate,
);
router.delete("/student/certificates/:id", student, s.deleteCertificate);
router.put("/student/:prn/scores", teacher, s.updateScores);
router.get("/student/:prn", owner, s.getStudentByPrn);
router.get("/placement", p.getAllPlacements);
router.post("/placement", teacher, p.createPlacement);
router.post("/placement/:id/notifications", teacher, p.retryNotifications);
router.delete("/placement/:id", teacher, p.deletePlacement);
router.post("/guidance", teacher, g.addGuidance);
router.get("/guidance", teacher, g.getAllGuidance);
router.get("/guidance/:prn", owner, g.getStudentGuidance);
router.get("/notification/:prn", owner, n.getNotificationsByPRN);
router.put("/notification/read/:id", student, n.markAsRead);
router.get("/training", t.getAllTrainingMaterials);
router.get("/training/my", student, t.getMyTrainingMaterials);
router.post("/training", teacher, t.createTrainingMaterial);
router.delete("/training/:id", teacher, t.deleteTrainingMaterial);
router.get(
  "/teacher/students-needing-guidance",
  teacher,
  wrap(async (req, res) =>
    res.json(
      await require("../models/Student")
        .find({ placementStatus: { $ne: "Placement Ready" } })
        .select("-password"),
    ),
  ),
);
module.exports = router;
