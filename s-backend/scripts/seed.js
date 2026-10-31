require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const { password } = require("../controllers/authController");

async function main() {
    const secret = password(process.env.SEED_PASSWORD);
    await mongoose.connect(process.env.MONGO_URI);
    const hashed = await bcrypt.hash(secret, 12);


    // Add only missing demo accounts. Never overwrite an existing password/profile.
    if (!(await Teacher.exists({ employeeId: "DEMO-TEACHER" })))
        await Teacher.create({
            employeeId: "DEMO-TEACHER",
            name: "Demo Teacher",
            email: "teacher@example.test",
            department: "CSE",
            designation: "Assistant Professor",
            password: hashed,
        });
    for (const [prn, cgpa] of [
        ["DEMO-STUDENT", 8],
        ["DEMO-STUDENT-2", 6],
    ])
        if (!(await Student.exists({ prn })))
            await Student.create({
                prn,
                name: prn === "DEMO-STUDENT" ? "Demo Student" : "Second Student",
                email: prn.toLowerCase() + "@example.test",
                department: "CSE",
                year: 3,
                cgpa,
                password: hashed,
                skills: ["JavaScript", "React"],
            });
    console.log(
        "Demo accounts ready. Teacher ID: DEMO-TEACHER, department: CSE. Student PRNs: DEMO-STUDENT, DEMO-STUDENT-2. Password: the SEED_PASSWORD you provided. Existing accounts were unchanged.",
    );
}
main()
    .catch((e) => {
        console.error(e.message);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
