# Student–Teacher Placement Portal

A MERN learning project with real MongoDB persistence, role-based access and authenticated server-sent events (SSE). Teacher changes automatically refresh connected student pages. This is a single-server application; see deployment limits below.

## Start here on Windows

Use Node.js 24 LTS and a running MongoDB Community Server (Compass is a client; it does not start the database). Extract this project into a NEW folder so your original project remains available.

### 1. Backend terminal

Open PowerShell in the extracted project folder:

```powershell
cd s-backend
npm ci
node scripts/setup.js
```

The setup command creates `.env` with a generated JWT secret and a local MongoDB connection. It never overwrites an existing `.env`. If you use Atlas, edit only `MONGO_URI` in `.env` to your own connection string; do not share it.

If reusing your existing `studentportal` database: back it up first, copy your old `s-backend/uploads` directory into the new backend, then run:

```powershell
npm run migrate
```

Migration hashes legacy plain-text passwords and recomputes derived scores/counts. It skips existing hashes. It prints identifiers of accounts with missing passwords; the administrator reset utility below handles those. Original passwords continue to work after hashing. An existing corrupt/double-hashed password needs an explicit reset.

To create demo accounts, choose a password in the local terminal:

```powershell
$env:SEED_PASSWORD = Read-Host "Choose a demo password (8+ characters)"
npm run seed
Remove-Item Env:SEED_PASSWORD
npm start
```

Leave this terminal running. The backend waits for MongoDB before listening on port 5000.

Demo accounts:

| Role | Identifier | Department | Password |
|---|---|---|---|
| Teacher | `DEMO-TEACHER` | `CSE` | The password you entered above |
| Student | `DEMO-STUDENT` | — | Same chosen password |
| Student | `DEMO-STUDENT-2` | — | Same chosen password |

Seeding adds missing demo accounts only. Running it again does NOT reset existing passwords. No real student records are included in this package.

### 2. Frontend terminal

Open another PowerShell terminal in the extracted project folder:

```powershell
cd student-profile
npm ci
npm run dev
```

Open **http://localhost:5173**. Use the Student/Teacher toggle to sign in. Both terminals must remain running.

The default API is `http://localhost:5000`. Set `VITE_API_URL` in `student-profile/.env` if your backend address differs. Restart Vite after editing frontend environment variables.

### 3. Check the complete live flow

1. Sign in as the teacher in a normal browser window.
2. Sign in as `DEMO-STUDENT` in an incognito/private window (separate storage prevents one role overwriting the other).
3. Keep the student Career page open. Create a teacher placement with minimum CGPA 7 and a future date. The drive appears without refreshing; the eligible student's notification count updates.
4. Send guidance to `DEMO-STUDENT`. It appears on that student's Career page.
5. Add a Year 3 training material. The student Materials page updates.
6. Update teacher-entered aptitude/communication scores from Students → View. Student readiness updates.
7. Add/edit/delete student projects. Count and readiness update; refresh to confirm persistence.
8. Upload a PDF certificate, photo and resume. Download the PDF. Test logout and login again.
9. Sign in as `DEMO-STUDENT-2` (CGPA 6). The CGPA-7 drive is visible as an opportunity, but that student does NOT receive its eligibility notification. All signed-in users can browse drives; notifications are eligibility-targeted.

An old drive is hidden from Upcoming but available through **Include past drives**. Date and time entry is campus time (Asia/Kolkata); all drives on today's date remain in Upcoming until the next day.

## Implemented features

- Student registration, bcrypt login, teacher login, JWT session restore, password changes and logout.
- Teacher accounts provisioned through a local admin script; no public teacher registration.
- Server-side role guards, student ownership checks, protected downloads, input validation and basic authentication rate limiting.
- Fresh database-backed profiles, student skill editing, resume/photo upload and teacher assessment scores.
- Project create/read/update/delete with GitHub links and automatically recalculated counts/scores.
- Certificate PDF upload/list/download/delete.
- Teacher student directory with name/PRN/department, CGPA and readiness filtering; portfolio details.
- Teacher guidance creation/history and private student guidance view.
- Placement create/list/delete, eligible notifications and idempotent notification retry.
- Training material create/list/delete, safe resource URLs and student year targeting.
- Private notification list, unread count and owner-only mark-as-read.
- Authenticated SSE invalidation stream, reconnect handling and refresh on tab focus.
- Responsive student/teacher navigation, loading/error/empty states and functional details controls.

## Administrative tools

Run these from `s-backend`. Password values are read from environment variables, never CLI arguments.

Create a teacher:

```powershell
$env:NEW_PASSWORD = Read-Host "New teacher password"
node scripts/create-teacher.js T102 "Teacher Name" teacher@example.com CSE "Assistant Professor"
Remove-Item Env:NEW_PASSWORD
```

Reset a missing/forgotten password:

```powershell
$env:NEW_PASSWORD = Read-Host "New password"
node scripts/reset-password.js student 2324000845
# For a teacher: node scripts/reset-password.js teacher T102
Remove-Item Env:NEW_PASSWORD
```

Password changes/resets invalidate prior JWTs on their next API request. A user changing their password is signed out. An open SSE stream is disconnected on an in-app password change; the administrator script takes effect on subsequent API requests/reconnect.

## Testing

```powershell
# s-backend
npm test
npm run test:integration

# student-profile
npm run lint
npm run build
```

The integration suite starts its OWN disposable MongoDB using mongodb-memory-server. First run downloads a MongoDB binary. If your environment cannot run that binary, use a separate local test database:

```powershell
$env:TEST_MONGO_URI = "mongodb://127.0.0.1:27017/placement_portal_test"
npm run test:integration
Remove-Item Env:TEST_MONGO_URI
```

**That dedicated test database is dropped when the integration suite starts. Never point this variable at your real student database.** The test runner checks the database name before clearing it.

Browser UI checks use API fixtures (they do not verify MongoDB). In `student-profile`, run `npx playwright install chromium --only-shell`, start `npm run dev` in one terminal, then run `npm run test:ui` in another. The test expects port 5173 and the default API URL.

See `docs/VALIDATION.md` for what was actually executed, and `docs/ASSESSMENT.md` for the 100-mark project assessment.

## Architecture and learning path

- `student-profile/src/pages/`: page-level React components.
- `student-profile/src/components.jsx`: shared forms, feedback and action controls.
- `student-profile/src/state.jsx`: session, queries and live-event subscription.
- `student-profile/src/api.js`: API client, protected downloads and display helpers.
- `s-backend/routes/index.js`: API contract and role/ownership middleware.
- `s-backend/controllers/`: validation, business operations and responses.
- `s-backend/models/`: existing Mongoose collection schemas.
- `s-backend/utils/events.js`: authenticated per-student event fan-out.
- `s-backend/middleware/uploads.js`: file signature/size checks and file storage.

Read `docs/LEARNING_GUIDE.md` after running the project. Explain one request from button click through MongoDB and back before taking the assessment.

## Deployment checklist and boundaries

This package is source code, not a hosted deployment. No changes have been pushed to your GitHub account.

Deploy the backend as one long-running Node process with a persistent `uploads` volume and MongoDB/Atlas. Set a unique JWT secret, HTTPS frontend origin in `CLIENT_ORIGIN`, and the database URI. Deploy the frontend's `dist` build with SPA fallback to `index.html`; set `VITE_API_URL` before building. SSE proxies must disable response buffering and allow long-lived connections.

The SSE client registry and auth rate limiter are in memory. Multiple backend instances require a shared event bus/rate-limit store. Uploads use local disk; ephemeral hosts need persistent storage or an object-storage adaptation. Public production registration needs institution verification/approval, and public file uploads should add malware scanning. This learning version has no email delivery, email-based forgotten-password flow, placement applications, placement guarantees, or external recruiter integration. Student academic/skill/internship data is self-reported; teacher assessment scores are controlled by the teacher role.

Teacher permissions are institution-wide, matching the original project (not restricted to one department). SSE invalidates views; MongoDB remains the source of truth. Direct edits in Compass do not emit SSE events; refresh or refocus the tab after administrative DB edits.

## Troubleshooting

- `ECONNREFUSED` or database connection error: start MongoDB Server; check `MONGO_URI`.
- Port 5000 already in use: stop the previous backend terminal before starting this one.
- Port 5173 in use: close the older Vite instance. The dev server uses a strict port to keep CORS consistent.
- `Invalid login details`: check Student/Teacher choice, identifier, teacher department and original password. Migrate plaintext records once; reset missing passwords explicitly.
- `Session expired`: log in again; a changed JWT secret invalidates previous sessions.
- File not found: restore the old uploads directory; MongoDB alone does not contain file bytes.
- Blank upcoming list: choose a future date or enable Include past drives.
- Missing live updates: check the sidebar Live indicator and both running terminals. Try a separate incognito session for the other role.
