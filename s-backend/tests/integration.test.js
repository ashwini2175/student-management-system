const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
let mongo,
  server,
  base,
  studentToken,
  otherToken,
  teacherToken,
  projectId,
  driveId,
  certificatePath;
const secret = "IntegrationTest123!";
async function request(path, { token, body, method = "GET" } = {}) {
  const res = await fetch(base + path, {
    method,
    headers: {
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...(body && !(body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
    },
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined,
  });
  const data = await res.json();
  return { status: res.status, data };
}
before(async () => {
  process.env.JWT_SECRET = "integration-only-secret-at-least-32-characters";
  if (process.env.TEST_MONGO_URI) {
    if (new URL(process.env.TEST_MONGO_URI).pathname !== "/placement_portal_test")
      throw new Error(
        "TEST_MONGO_URI must name a dedicated placement_portal_test database.",
      );
    await mongoose.connect(process.env.TEST_MONGO_URI);
    await mongoose.connection.dropDatabase();
  } else {
    mongo = await MongoMemoryServer.create({
      binary: { version: process.env.MONGOMS_VERSION || "7.0.24" },
    });
    await mongoose.connect(mongo.getUri());
  }
  await Teacher.create({
    employeeId: "T1",
    name: "Teacher",
    email: "teacher@test.example",
    department: "CSE",
    designation: "Professor",
    password: await bcrypt.hash(secret, 4),
  });
  await require("../models/Notification").init();
  server = require("../app").listen(0);
  await new Promise((r) => server.once("listening", r));
  base = "http://127.0.0.1:" + server.address().port;
});
after(async () => {
  require("../utils/events").close();
  if (server) await new Promise((r) => server.close(r));
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
test("student password login and teacher role boundaries", async () => {
  // Create isolated test accounts, then sign in through the actual API.
  const tokens = [];
  for (const [prn, cgpa] of [["S1", 8], ["S2", 6]]) {
    const account = await Student.create({ prn, cgpa, name: prn, email: prn + "@example.test", department: "CSE", year: 3, password: await bcrypt.hash(secret, 4) });
    tokens.push((await request("/student/login", { method: "POST", body: { prn: account.prn, password: secret } })).data.token);
  }
  [studentToken, otherToken] = tokens;
  assert.equal((await request("/student/login", { method: "POST", body: { prn: "S1", password: "incorrect" } })).status, 401);
  teacherToken = (await request("/teacher/login", { method: "POST", body: { employeeId: "T1", department: "cse", password: secret } })).data.token;
  assert.ok(teacherToken);
  assert.equal((await request("/student")).status, 401);
  assert.equal((await request("/student", { token: studentToken })).status, 403);
  assert.equal((await request("/student/profile", { token: teacherToken })).status, 403);
  assert.equal((await request("/student/S2", { token: studentToken })).status, 403);
});
test("profile and project CRUD persist and recalculate score/count without allowing mass assignment", async () => {
  let r = await request("/student/profile", {
    token: studentToken,
    method: "PUT",
    body: { skills: ["React", "Node"], aptitudeScore: 100, password: "bad" },
  });
  assert.equal(r.status, 200);
  assert.equal(r.data.student.aptitudeScore, 0);
  const baseline = r.data.student.placementScore;
  r = await request("/student/projects", {
    token: studentToken,
    method: "POST",
    body: { title: "Portal", githubLink: "https://github.com/example/portal" },
  });
  assert.equal(r.status, 201);
  projectId = r.data.project._id;
  assert.equal(
    (await request("/student/profile", { token: studentToken })).data
      .placementScore,
    baseline + 5,
  );
  r = await request("/student/projects/" + projectId, {
    token: studentToken,
    method: "PUT",
    body: {
      title: "Updated",
      githubLink: "https://github.com/example/updated",
    },
  });
  assert.equal(r.status, 200);
  assert.equal(
    (await request("/student/projects", { token: studentToken })).data
      .projects[0].githubLink,
    "https://github.com/example/updated",
  );
  assert.equal(
    (
      await request("/student/projects/" + projectId, {
        token: otherToken,
        method: "DELETE",
      })
    ).status,
    404,
  );
  assert.equal(
    (
      await request("/student/projects/" + projectId, {
        token: studentToken,
        method: "DELETE",
      })
    ).status,
    200,
  );
  r = await request("/student/profile", { token: studentToken });
  assert.equal(r.data.projectCount, 0);
  assert.equal(r.data.placementScore, baseline);
});
test("placement creates eligible-only notifications, retry is idempotent, read is owner-only", async () => {
  const body = {
    company: "Demo",
    role: "Developer",
    eligibilityCGPA: 7,
    package: "8 LPA",
    driveDate: "2099-10-25",
    time: "09:00",
    location: "Campus",
  };
  assert.equal(
    (await request("/placement", { token: studentToken, method: "POST", body }))
      .status,
    403,
  );
  let r = await request("/placement", {
    token: teacherToken,
    method: "POST",
    body: { ...body, driveDate: "2099-02-31" },
  });
  assert.equal(r.status, 400);
  r = await request("/placement", {
    token: teacherToken,
    method: "POST",
    body,
  });
  assert.equal(r.status, 201);
  assert.equal(r.data.notificationsSent, 1);
  driveId = r.data.placement._id;
  await request("/placement/" + driveId + "/notifications", {
    token: teacherToken,
    method: "POST",
  });
  const notes = (await request("/notification/S1", { token: studentToken }))
    .data;
  assert.equal(notes.length, 1);
  assert.equal(
    (await request("/notification/S2", { token: otherToken })).data.length,
    0,
  );
  assert.equal(
    (await request("/notification/S1", { token: otherToken })).status,
    403,
  );
  assert.equal(
    (
      await request("/notification/read/" + notes[0]._id, {
        token: otherToken,
        method: "PUT",
      })
    ).status,
    404,
  );
  assert.equal(
    (
      await request("/notification/read/" + notes[0]._id, {
        token: studentToken,
        method: "PUT",
      })
    ).data.notification.isRead,
    true,
  );
  assert.equal(
    (await request("/placement", { token: studentToken })).data.length,
    1,
  );
});
test("guidance is saved for an existing student and isolated by PRN", async () => {
  const body = {
    studentPRN: "S1",
    title: "Practice",
    message: "Build a feature",
    category: "Project",
  };
  assert.equal(
    (await request("/guidance", { token: studentToken, method: "POST", body }))
      .status,
    403,
  );
  assert.equal(
    (
      await request("/guidance", {
        token: teacherToken,
        method: "POST",
        body: { ...body, studentPRN: "missing" },
      })
    ).status,
    404,
  );
  assert.equal(
    (await request("/guidance", { token: teacherToken, method: "POST", body }))
      .status,
    201,
  );
  assert.equal(
    (await request("/guidance/S1", { token: studentToken })).data[0].message,
    body.message,
  );
  assert.equal(
    (await request("/guidance/S1", { token: otherToken })).status,
    403,
  );
});
test("training uses authenticated teacher identity, safe links and year targeting", async () => {
  let body = {
    title: "React",
    year: 3,
    category: "Web",
    type: "Link",
    link: "javascript:alert(1)",
    uploadedBy: "Spoof",
  };
  assert.equal(
    (await request("/training", { token: teacherToken, method: "POST", body }))
      .status,
    400,
  );
  body.link = "https://react.dev/learn";
  assert.equal(
    (await request("/training", { token: teacherToken, method: "POST", body }))
      .data.trainingMaterial.uploadedBy,
    "Teacher",
  );
  await request("/training", {
    token: teacherToken,
    method: "POST",
    body: { ...body, year: 4 },
  });
  assert.equal(
    (await request("/training", { token: studentToken })).data.length,
    1,
  );
});
test("PDF uploads validate contents and protect downloads from other accounts", async () => {
  const f = new FormData();
  f.append("title", "Course");
  f.append("issuer", "Institute");
  f.append("year", "2026");
  f.append(
    "certificate",
    new Blob(["%PDF-1.4\n%%EOF"], { type: "application/pdf" }),
    "test.pdf",
  );
  let r = await request("/student/certificates", {
    token: studentToken,
    method: "POST",
    body: f,
  });
  assert.equal(r.status, 201);
  certificatePath = r.data.certificate.fileUrl;
  assert.equal((await fetch(base + certificatePath)).status, 401);
  assert.equal(
    (
      await fetch(base + certificatePath, {
        headers: { Authorization: "Bearer " + otherToken },
      })
    ).status,
    404,
  );
  assert.equal(
    (
      await fetch(base + certificatePath, {
        headers: { Authorization: "Bearer " + studentToken },
      })
    ).status,
    200,
  );
  const bad = new FormData();
  bad.append(
    "resume",
    new Blob(["not pdf"], { type: "application/pdf" }),
    "fake.pdf",
  );
  assert.equal(
    (
      await request("/student/profile/resume", {
        token: studentToken,
        method: "PUT",
        body: bad,
      })
    ).status,
    400,
  );
  const resume = new FormData();
  resume.append("resume", new Blob(["%PDF-1.4\n%%EOF"]), "resume.pdf");
  r = await request("/student/profile/resume", {
    token: studentToken,
    method: "PUT",
    body: resume,
  });
  assert.equal(r.status, 200);
  assert.equal(r.data.student.resumeUploaded, true);
  await request("/student/profile/resume", {
    token: studentToken,
    method: "DELETE",
  });
  await request(
    "/student/certificates/" +
      (await request("/student/certificates", { token: studentToken })).data
        .certificates[0]._id,
    { token: studentToken, method: "DELETE" },
  );
});
test("teacher assessment update reaches an authenticated SSE subscriber", async () => {
  const controller = new AbortController();
  const res = await fetch(base + "/events", {
    headers: { Authorization: "Bearer " + studentToken },
    signal: controller.signal,
  });
  assert.equal(res.status, 200);
  const reader = res.body.getReader();
  await reader.read();
  const r = await request("/student/S1/scores", {
    token: teacherToken,
    method: "PUT",
    body: { aptitudeScore: 80, communicationScore: 90 },
  });
  assert.equal(r.status, 200);
  const event = await reader.read();
  assert.match(new TextDecoder().decode(event.value), /student/);
  controller.abort();
  assert.equal(
    (
      await request("/student/S1/scores", {
        token: studentToken,
        method: "PUT",
        body: { aptitudeScore: 100, communicationScore: 100 },
      })
    ).status,
    403,
  );
});
test("teacher password change invalidates old session; incorrect current password is rejected", async () => {
  assert.equal((await request("/auth/password", { token: studentToken, method: "PUT", body: { currentPassword: "incorrect", newPassword: "ChangedPassword123!" } })).status, 400);
  assert.equal((await request("/auth/password", { token: teacherToken, method: "PUT", body: { currentPassword: secret, newPassword: "ChangedPassword123!" } })).status, 200);
  assert.equal((await request("/auth/me", { token: teacherToken })).status, 401);
  assert.equal((await request("/teacher/login", { method: "POST", body: { employeeId: "T1", department: "CSE", password: secret } })).status, 401);
  assert.equal((await request("/teacher/login", { method: "POST", body: { employeeId: "T1", department: "CSE", password: "ChangedPassword123!" } })).status, 200);
});
