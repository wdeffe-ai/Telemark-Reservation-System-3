# Telemark Reservation - Member Manager (mobile + backend)

This folder contains a complete specification and a starter implementation (backend + mobile) for managing the membership database that lives in the repository as a JSON file. The code is organized so you can iterate on the spec and then extend or deploy the starter services.

Important
- The canonical membership database file is at `SPEC/member-management/data/members.json`.
- Only these roles are allowed to modify the database: President, MembershipChair, Treasurer.
- The backend commits changes to the repository using a GitHub Personal Access Token (PAT). The PAT must have `repo` scope for private repos or `public_repo` for public repos.

Structure
- SPEC/member-management/
  - README.md (this file)
  - spec.md (formal spec and acceptance criteria)
  - data/members.json (sample canonical database)
  - api/openapi.yaml (API contract)
  - ui/wireframes.md (high-level UI wireframes & acceptance criteria)
  - deploy/notes.md (deployment & security notes)
  - backend/ (Express + TypeScript backend that reads/writes the JSON file via GitHub API)
  - mobile/ (Expo + React Native TypeScript starter app)

Next
- Review `spec.md` for the formal rules and acceptance criteria.
- Fill secrets in `backend/.env.example` and deploy the backend on a trusted host.
- Start the mobile app with Expo after setting BACKEND_URL in `mobile/src/config.ts`.
