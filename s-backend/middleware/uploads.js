const multer = require("multer");
const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { fail } = require("../utils/http");
exports.upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
});
exports.persist = async (file, kind) => {
  if (!file) throw fail(400, "Please choose a file.");
  const b = file.buffer;
  let ext;
  if (kind === "photo") {
    if (b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
      ext = ".png";
    else if (b[0] === 255 && b[1] === 216 && b[2] === 255) ext = ".jpg";
    else if (
      b.toString("ascii", 0, 4) === "RIFF" &&
      b.toString("ascii", 8, 12) === "WEBP"
    )
      ext = ".webp";
    else throw fail(400, "Choose a PNG, JPG or WebP image.");
    if (b.length > 5 * 1024 * 1024)
      throw fail(400, "Photo must be under 5 MB.");
  } else {
    if (b.toString("ascii", 0, 5) !== "%PDF-")
      throw fail(400, "Choose a PDF file.");
    ext = ".pdf";
  }
  const dir = path.join(__dirname, "../uploads", kind);
  await fs.mkdir(dir, { recursive: true });
  const name = randomUUID() + ext;
  await fs.writeFile(path.join(dir, name), b);
  return `/uploads/${kind}/${name}`;
};
exports.remove = async (url) => {
  if (!url?.startsWith("/uploads/")) return;
  const root = path.resolve(__dirname, "../uploads");
  const target = path.resolve(__dirname, "..", url.slice(1));
  if (target.startsWith(root + path.sep))
    await fs.unlink(target).catch(() => {});
};
