# UI update — 26 October 2026

1. Make a backup copy of your existing student-profile/src folder.
2. Extract placement-ui-update.zip into a temporary folder.
3. Copy the three files into the same locations in your running project, replacing the existing files:
   - student-profile/src/App.jsx
   - student-profile/src/index.css
   - student-profile/src/pages/Dashboard.jsx
4. Leave your api.js, backend, .env and database unchanged.
5. In student-profile, run npm run dev if the frontend is stopped. Refresh the browser.

The UI uses react-icons, already included in the supplied project package. If a missing react-icons dependency error appears, run npm ci in student-profile.

Changes: indigo/navy theme, navigation icons, active page highlighting, page breadcrumb, role/account header, dashboard quick actions and welcome banner, readable tables/forms, mobile expandable navigation, keyboard skip link and reduced-motion support.

This update changes presentation and navigation. It does not add AI recommendations, email verification or the proposed new scoring formula.
