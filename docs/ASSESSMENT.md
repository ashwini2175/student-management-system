# Project assessment — 100 marks

Take this after running the complete local demo. Allow 75–90 minutes. Answer in your own words; do not paste the guide. Send answers in chat in groups and we will score them with feedback. This is a practical assessment, not proof of production readiness.

## Round 1: Architecture and request flow — 15 marks

1. Explain what React, Node, Express, MongoDB and Mongoose each do in this project. (5)
2. Trace Add Project from click to persistence and updated dashboard; name the relevant files. (7)
3. Why does a saved project survive a browser refresh, while an unsaved form does not? (3)

## Round 2: React and API contracts — 15 marks

4. Explain `useState`, `useEffect` cleanup and why the API request is not made directly inside JSX rendering. (5)
5. Explain the original `companyName` versus `company` bug. Show the JSON that the placement API expects. (5)
6. Explain loading, empty and error states; why should a failed fetch not be presented as “No records”? (5)

## Round 3: Backend and data modeling — 20 marks

7. Why are projects embedded in Student while placements are separate documents? Give a trade-off. (5)
8. Explain the score formula, when it recalculates and why trusting `projectCount` in a client request is unsafe. (5)
9. Show how a project update ensures it belongs to the logged-in student. (5)
10. Explain validation and the difference between 400, 401, 403, 404 and 409 in this app. (5)

## Round 4: Authentication and authorization — 20 marks

11. Explain hash versus encryption, bcrypt salt, and why hashing twice breaks login. (6)
12. Describe JWT signing, expiry, account lookup and role/owner checks. (6)
13. Demonstrate that a student cannot send guidance, edit assessment scores or read another student's notifications. Use Postman or explain the exact requests and expected statuses. (5)
14. Why are teacher provisioning and missing-password reset local administrator tools? (3)

## Round 5: Real-time behavior and reliability — 10 marks

15. Explain the SSE connection, invalidation/refetch, reconnect behavior and why events do not carry private records. (5)
16. What happens when placement saving succeeds but notifications fail? Explain why retry does not duplicate them. (5)

## Round 6: Independent implementation — 20 marks

17. Add a “Completed projects only” checkbox to Projects, keeping the original array and filtering only the displayed list. Explain your state and filter. (8)
18. Add a teacher filter for students without a resume and show it working. (6)
19. Write a meaningful automated test for one boundary you changed. Explain what regression it catches. (6)

## Scoring guidance

Full marks require correct reasoning and a working demonstration where requested. Give partial marks for correct concepts with missing detail; no marks for pasted code that cannot be explained. For practical questions, correctness, handling empty/error cases and explaining the change matter more than visual styling.

- 85–100: strong project understanding; proceed to deeper testing/deployment and independent features.
- 65–84: working understanding; review the weaker areas and repeat one practical task.
- 45–64: guided understanding; trace requests and practice small features without copying.
- Below 45: rebuild a small CRUD flow independently before claiming full-stack proficiency.
