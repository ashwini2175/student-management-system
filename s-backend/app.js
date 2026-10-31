const express = require("express");
const cors = require("cors");
const path = require("node:path");
const { wrap, fail } = require("./utils/http");
const auth = require("./middleware/authMiddleware");
const Student = require("./models/Student");
const app = express();
app.disable("x-powered-by");
const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());
app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || origins.includes(origin)),
  }),
);
app.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Referrer-Policy", "no-referrer");
  next();
});
app.use(express.json({ limit: "100kb" }));
// Simple single-instance auth rate limit; use a shared store for multiple servers.
const attempts = new Map();
app.use((req, res, next) => {
  if (
    req.method !== "POST" ||
    ![
      "/student/login",
      "/teacher/login",
      "/auth/student-login",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/student",
    ].includes(req.path)
  )
    return next();
  const now = Date.now();
  for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
  const isReset = req.path.includes("password");
  const key = req.ip + (isReset ? ":reset" : ":login");
  const entry = attempts.get(key) || { count: 0, until: now + 15 * 60 * 1000 };
  entry.count++;
  attempts.set(key, entry);
  if (entry.count > (isReset ? 10 : 100)) {
    res.set("Retry-After", String(Math.ceil((entry.until - now) / 1000)));
    return res
      .status(429)
      .json({ message: "Too many attempts. Try again later." });
  }
  next();
});
app.get("/health", (req, res) =>
  res.json({
    status: "ok",
    database:
      require("mongoose").connection.readyState === 1
        ? "connected"
        : "disconnected",
  }),
);
// File downloads are authenticated and checked against the owner's document.
app.get(
  "/uploads/:kind/:name",
  auth,
  wrap(async (req, res) => {
    const { kind, name } = req.params;
    if (
      !/^[a-zA-Z0-9_.-]+$/.test(name) ||
      !["photo", "profile", "resume", "certificates"].includes(kind)
    )
      throw fail(404, "File not found.");
    const url = `/uploads/${kind}/${name}`;
    const owner = await Student.findOne({
      $or: [
        { profilePhoto: url },
        { resumeUrl: url },
        { "certificates.fileUrl": url },
      ],
    }).select("_id");
    if (
      !owner ||
      (req.user.role !== "Teacher" && String(owner._id) !== req.user.id)
    )
      throw fail(404, "File not found.");
    res.set("Cache-Control", "private, no-store");
    if (kind === "certificates" || kind === "resume")
      res.set("Content-Disposition", "attachment");
    res.sendFile(path.join(__dirname, "uploads", kind, name), (err) => {
      if (err && !res.headersSent)
        res.status(404).json({ message: "File no longer exists." });
    });
  }),
);
app.use(require("./routes"));
app.use((req, res) => res.status(404).json({ message: "Endpoint not found." }));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  let status = error.status || 500;
  let message = error.message;
  if (error.name === "VersionError") {
    status = 409;
    message = "This record changed in another session. Refresh and retry.";
  }
  if (error.code === 11000) {
    status = 409;
    message = "An account with this identifier already exists.";
  }
  if (["ValidationError", "CastError", "MulterError"].includes(error.name)) {
    status = 400;
    message =
      error.name === "MulterError"
        ? "File too large or invalid upload field."
        : error.message;
  }
  if (status === 500) {
    console.error(error.name);
    message = "Server error. Please try again.";
  }
  res.status(status).json({ message });
});
module.exports = app;
