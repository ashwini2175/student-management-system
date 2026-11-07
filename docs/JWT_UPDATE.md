# Password + JWT update

Google authentication has been removed from the active application. This package supersedes placement-google-update.zip and includes the improved UI.

## Apply

1. Back up your source and database.
2. Extract this ZIP into a temporary folder. Copy the included s-backend and student-profile folders over the corresponding existing folders, replacing included files. Do NOT delete the existing folders: preserve .env and uploads.
3. In each folder run npm ci.
4. Restart backend with npm start and frontend with npm run dev.
5. Teacher login remains Employee ID, department, password. Student login uses PRN and password; new students can register.
6. If you previously copied Google files, delete the now-unused s-backend/controllers/googleAuthController.js, s-backend/tests/google-auth.test.js and student-profile/src/GoogleSignIn.jsx. Remove GOOGLE_CLIENT_ID from .env if desired; it is unused. No Google setup is needed.

Existing password-backed records stay unchanged. If you actually created passwordless Google accounts before switching, set a local password through scripts/reset-password.js student PRN. Do not delete their records. Google sessions already issued expire normally or can be invalidated by a password change/reset; Google endpoints no longer exist.

## Security implemented

- bcrypt password hashes, never returned in serialized account responses.
- JWT signature/expiry checks with HS256 and a server-held secret; one-day sessions.
- Student/teacher role and student ownership checks, protected uploaded-file downloads.
- Old sessions rejected after password version changes.
- Input validation and single-process authentication rate limiting.
- Explicit registration fields prevent injecting teacher privileges or scores.

JWT is a session mechanism, not email/phone verification or two-factor authentication. Email/phone ownership is not verified. Authentication tokens currently use browser localStorage; production hardening should consider HttpOnly session cookies with CSRF protection, HTTPS, a shared limiter and an audit. This is not a production security certification.

## Checks

Backend five unit tests and frontend lint/build passed. Browser regression uses mocked API responses, not your actual database. Real MongoDB integration tests remain unverified here due to environment restrictions; run locally. Verify both roles, logout, wrong passwords, private data boundaries and persistence before your demo.
