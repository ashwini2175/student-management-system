# Understand your project

## 1. What the four MERN parts do

React renders the interface and holds temporary form state. Express defines HTTP endpoints and middleware. Node runs the backend JavaScript process. MongoDB stores student, teacher, placement, guidance, notification and training documents. Mongoose validates documents and maps JavaScript operations to MongoDB.

## 2. Trace a project save

1. `pages/Projects.jsx` collects title, repository, description, technologies and status.
2. `components.jsx` prevents default form submission, disables the button and handles success/errors.
3. `api.js` sends JSON and `Authorization: Bearer ...`.
4. `routes/index.js` matches POST `/student/projects` and runs JWT plus Student-role checks.
5. `authMiddleware.js` verifies the signature/expiry and loads the current account.
6. `studentController.js` validates the repository, pushes a subdocument and saves the owning student.
7. The Student pre-validation hook recalculates project count, readiness score and status.
8. The controller publishes an invalidation event and returns the saved project.
9. The frontend refetches the relevant database-backed views. Refreshing the browser still shows the saved project because MongoDB, not React state, owns the record.

## 3. Why the earlier login failed

`bcrypt.compare(enteredPassword, storedHash)` expects a bcrypt hash as its second argument. A plain-text database password cannot be treated as a bcrypt hash. Registration now always hashes once; migration handles old records once. Hashing an already-hashed password again breaks the original login. A password hash is not encryption and is not decrypted during login.

## 4. Authentication versus authorization

Authentication answers “who is this account?” JWT verification and account lookup provide this. Authorization answers “may this account perform this action?” The Teacher/Student guards and owner checks answer that. Hiding a button in React is not a security boundary: the backend must reject unauthorized requests made directly using Postman.

## 5. API field names are a contract

The backend accepts `company`, `driveDate` and `time`. Labels in a form do not change request keys. If the frontend sends `companyName`, the backend receives no `company`. The new form uses the same names as the API. Field validation is duplicated where useful: HTML improves usability; backend validation is authoritative.

## 6. How live updates work

After login, the frontend opens an authenticated SSE request to `/events`. The backend retains that open response and sends small events after mutations. A guidance event for one PRN goes only to that student and teachers. An event contains no student document. The frontend responds by refetching authorized APIs. When disconnected, it reconnects and refetches so missed events do not cause a permanently stale screen. This is server-to-client streaming; normal POST/PUT/DELETE requests handle client-to-server changes.

## 7. Readiness is a deterministic preparation score

CGPA contributes up to 25, skills 20, actual projects 15, internships 15, resume 10, aptitude 10 and communication 5. Score and status are derived, not editable request fields. Thresholds are 80 for Placement Ready, 50 for Needs Guidance, otherwise Immediate Attention. This is not an ML model or employment probability.

## 8. Files and database are different storage

The uploaded PDF/image bytes live in the backend's uploads directory. MongoDB stores metadata and relative paths. Downloads check a valid session and ownership before serving bytes. Backing up only MongoDB does not back up the files. Signature checks detect obvious wrong formats, but are not malware scanning.

## 9. Failure handling

400 is invalid input, 401 means missing/expired/invalid authentication, 403 means authenticated but forbidden, 404 means a resource is unavailable, 409 means a conflicting record/update, 429 is rate limiting, and 500 is an unexpected server error. The placement controller returns a warning if the drive saved but notification creation failed. Retry notifications uses a unique source key and an upsert, so retrying does not create duplicate notifications.

## 10. Explain honestly in an interview

“I integrated and debugged a MERN placement portal with assistance. I can trace the API flow, explain hashing and authorization, and show live teacher-to-student updates. I am practicing implementing small changes independently.”

Then demonstrate an actual flow and explain the relevant source files. Avoid claiming you independently wrote or deployed features you have not understood or run.
