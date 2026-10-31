require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const calculate = require("../utils/calculatePlacementScore");
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const Model of [Student, Teacher]) {
    let converted = 0,
      hashed = 0,
      missing = 0;
    for await (const doc of Model.find().cursor()) {
      const update = {};
      const current = doc.password;
      if (typeof current !== "string" || !current) {
        missing++;
        console.log(
          "Password setup required for",
          Model.modelName,
          doc.prn || doc.employeeId,
        );
      } else if (/^\$2[aby]\$/.test(current)) {
        hashed++;
      } else {
        update.password = await bcrypt.hash(current, 12);
        converted++;
      }
      if (Model === Student) {
        update.projectCount = doc.projects.length;
        update.placementScore = calculate(doc);
        update.placementStatus =
          update.placementScore >= 80
            ? "Placement Ready"
            : update.placementScore >= 50
              ? "Needs Guidance"
              : "Immediate Attention";
      }
      if (Object.keys(update).length)
        await Model.updateOne(
          {
            _id: doc._id,
            ...(current === undefined
              ? { password: { $exists: false } }
              : { password: current }),
          },
          { $set: update },
        );
    }
    console.log(Model.modelName, { converted, alreadyHashed: hashed, missing });
  }
}
main()
  .catch((e) => {
    console.error(e.name);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
