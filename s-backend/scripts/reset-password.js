// Local administrator utility. No public password-reset endpoint.
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { password } = require("../controllers/authController");
async function main() {
  const [role, id] = process.argv.slice(2);
  if (!["student", "teacher"].includes(role) || !id)
    throw new Error(
      "Usage: node scripts/reset-password.js student PRN (or teacher EMPLOYEE_ID); set NEW_PASSWORD first.",
    );
  const secret = password(process.env.NEW_PASSWORD);
  await mongoose.connect(process.env.MONGO_URI);
  const Model = require(
    "../models/" + (role === "student" ? "Student" : "Teacher"),
  );
  const result = await Model.updateOne(
    { [role === "student" ? "prn" : "employeeId"]: id },
    {
      $set: { password: await bcrypt.hash(secret, 12) },
      $inc: { tokenVersion: 1 },
    },
  );
  console.log(
    result.matchedCount
      ? "Password updated."
      : "Account not found; no changes made.",
  );
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
