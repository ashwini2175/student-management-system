# Validation report

Validated on 25 October 2026 against the completed source package.

## Passed

- Backend: five unit tests for score calculation, schema-derived fields, password serialization, input validation and role guards.
- Frontend: ESLint and Vite production build.
- Chromium browser regression using explicit API fixtures: student and teacher login, session restoration, project create/edit/delete, student and teacher page navigation, placement details, mobile overflow and absence of browser runtime errors.
- Mobile Career page visually checked at 390px width.

The browser tests substitute API responses. They do not prove database persistence, JWT validation, upload storage or live event delivery against the real server.

## Blocked here: real database integration

Nine integration scenarios are included in `s-backend/tests/integration.test.js`. The disposable MongoDB process could not start in this environment: `open: Operation not permitted` (exit code 100). These scenarios have NOT passed here. Use the dedicated local test database instructions in README to execute them. The test database is cleared at startup; never use your real database.

Before your demo, run the README live-flow checklist with a running MongoDB server and two separate browser sessions. Verify refresh persistence, authorization, eligible notifications, live guidance and protected uploads. No production deployment or GitHub push was performed.

## Fix found during verification

Aborting a request during navigation could turn a JSON parsing cancellation into an object used as an array. The API client now preserves AbortError, and list queries validate response shape and avoid updating state after cancellation. Browser navigation regression passes with this fix.
