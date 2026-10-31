require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { password, email } = require("../controllers/authController");
const { text } = require("../utils/http");
async function main() {
  const [employeeId, name, mail, department, designation] =
    process.argv.slice(2);
  const data = {
    employeeId: text(employeeId, "Employee ID"),
    name: text(name, "Name"),
    email: email(mail),
    department: text(department, "Department"),
    designation: text(designation, "Designation"),
    password: await bcrypt.hash(password(process.env.NEW_PASSWORD), 12),
  };
  await mongoose.connect(process.env.MONGO_URI);
  await require("../models/Teacher").create(data);
  console.log("Teacher created.");
}
main()
  .catch((e) => {
    console.error(
      e.code === 11000 ? "Teacher ID or email already exists." : e.message,
    );
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
