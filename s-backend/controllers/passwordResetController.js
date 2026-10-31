const crypto = require("node:crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const { wrap, fail, text } = require("../utils/http");
const { password, email } = require("./authController");
const hash = (token) => crypto.createHash("sha256").update(token).digest("hex");
const model = (role) => {
  if (!["Student", "Teacher"].includes(role)) throw fail(400, "Select Student or Teacher.");
  return role === "Student" ? Student : Teacher;
};
exports.forgot = wrap(async (req, res) => {
  const Model = model(req.body.role);
  const identifier = text(req.body.identifier, "PRN / Employee ID", 200);
  const address = email(req.body.email);
  const origin = new URL(process.env.RESET_ORIGIN || "http://localhost:5173");
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS)
    throw fail(503, "Email recovery is not configured. Contact the administrator.");
  const account = await Model.findOne({
    [req.body.role === "Student" ? "prn" : "employeeId"]: identifier,
  });
  // Match both identifier and email: legacy student emails need not be unique.
  if (account && account.email?.trim().toLowerCase() === address) {
    const token = crypto.randomBytes(32).toString("hex");
    const resetHash = hash(token);
    await Model.updateOne({ _id: account._id }, { $set: {
      resetHash, resetExpires: new Date(Date.now() + 15 * 60 * 1000),
    }});
    const link = new URL("/reset-password", origin.origin);
    link.hash = new URLSearchParams({ token, role: req.body.role }).toString();
    try {
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT || 465),
        secure: process.env.SMTP_SECURE !== "false",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        connectionTimeout: 10000, socketTimeout: 15000,
      });
      await transport.sendMail({
        from: process.env.SMTP_USER, to: account.email,
        subject: "Reset your Placement Portal password",
        text: `Use this link within 15 minutes to reset your password:\n\n${link.href}\n\nThis link works once. If you did not request it, ignore this email.`,
      });
    } catch {
      await Model.updateOne({ _id: account._id, resetHash }, {
        $unset: { resetHash: 1, resetExpires: 1 },
      });
      // Never expose account existence or SMTP credentials to the caller/logs.
      console.error("Password reset email delivery failed. Check SMTP configuration.");
    }
  }
  res.json({ message: "If these details match an account, a reset link will arrive by email. Check your spam folder too." });
});
exports.reset = wrap(async (req, res) => {
  const Model = model(req.body.role);
  const token = req.body.token;
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token))
    throw fail(400, "Invalid or expired reset link. Request a new link.");
  const secret = password(req.body.newPassword);
  // Atomic update consumes the token: concurrent requests cannot reuse it.
  const account = await Model.findOneAndUpdate({
    resetHash: hash(token), resetExpires: { $gt: new Date() },
  }, {
    $set: { password: await bcrypt.hash(secret, 12) },
    $unset: { resetHash: 1, resetExpires: 1 },
    $inc: { tokenVersion: 1, __v: 1 },
  });
  if (!account) throw fail(400, "Invalid or expired reset link. Request a new link.");
  require("../utils/events").disconnect(String(account._id));
  res.json({ message: "Password updated. Sign in with your new password." });
});
