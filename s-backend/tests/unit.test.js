const { test } = require("node:test");
const assert = require("node:assert/strict");
const Student = require("../models/Student");
const calculate = require("../utils/calculatePlacementScore");
const { text, number, url, safe } = require("../utils/http");
const { password, email } = require("../controllers/authController");
const base = {
  name: "Test",
  prn: "TEST",
  email: "test@example.test",
  department: "CSE",
  year: 3,
  cgpa: 8,
  password: "hashed-placeholder",
};
test("score is bounded and uses actual projects rather than a client count", () => {
  assert.equal(
    calculate({
      cgpa: 10,
      skills: ["a", "b", "c", "d", "e"],
      projects: [{}, {}, {}],
      internshipCount: 2,
      resumeUploaded: true,
      aptitudeScore: 100,
      communicationScore: 100,
    }),
    100,
  );
  assert.equal(
    calculate({ cgpa: 8, projectCount: 999, projects: [], skills: [] }),
    20,
  );
  assert.equal(calculate({ cgpa: -2, aptitudeScore: -10 }), 0);
});
test("student validation recomputes derived score and project count", async () => {
  const s = new Student({
    ...base,
    projectCount: 99,
    placementScore: 100,
    skills: ["React"],
    projects: [{ title: "Portal" }],
  });
  await s.validate();
  assert.equal(s.projectCount, 1);
  assert.equal(s.placementScore, 29);
  assert.equal(s.placementStatus, "Immediate Attention");
  s.projects[0].deleteOne();
  await s.validate();
  assert.equal(s.projectCount, 0);
  assert.equal(s.placementScore, 24);
});
test("password hashes never appear in serialized student or teacher documents", () => {
  assert.equal(new Student(base).toJSON().password, undefined);
  assert.equal(safe(new Student(base)).password, undefined);
  assert.equal(
    new (require("../models/Teacher"))({ password: "secret" }).toJSON()
      .password,
    undefined,
  );
});
test("validation rejects empty inputs, invalid numbers, unsafe URLs and oversized bcrypt inputs", () => {
  assert.throws(() => text("  ", "Name"));
  assert.throws(() => number("", "CGPA", 0, 10));
  assert.throws(() => number(11, "CGPA", 0, 10));
  assert.throws(() => url("javascript:alert(1)"));
  assert.throws(() => url("https://user:pass@example.com"));
  assert.equal(url("https://example.com"), "https://example.com/");
  assert.equal(email("TEST@EXAMPLE.COM"), "test@example.com");
  assert.throws(() => password("short"));
  assert.throws(() => password("😀".repeat(20)));
});
test("role guards enforce teacher-only and student ownership boundaries", () => {
  const roles = require("../middleware/roles");
  let result;
  roles.teacher({ user: { role: "Student" } }, {}, (e) => (result = e));
  assert.equal(result.status, 403);
  roles.owner(
    { user: { role: "Student", prn: "A" }, params: { prn: "B" } },
    {},
    (e) => (result = e),
  );
  assert.equal(result.status, 403);
  roles.owner(
    { user: { role: "Student", prn: "A" }, params: { prn: "A" } },
    {},
    (e) => (result = e),
  );
  assert.equal(result, undefined);
});
