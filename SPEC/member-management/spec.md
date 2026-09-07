# Member Management Specification

This document defines the membership database schema, validation rules, role-based access control, workflows for edits, and audit expectations.

Schema (per-member)
- memberNumber (string): 6-digit identifier, zero-padded (e.g. "000001"). Primary key.
- firstName (string): required, 1-100 characters.
- lastName (string): required, 1-100 characters.
- phone (string): optional, E.164 recommended but freeform allowed.
- email (string): optional, must validate as an email if provided.
- address (string): optional, up to 500 chars.
- sex (string): optional, allowed values: "M", "F", "Other", "PreferNotToSay".
- memberType (string): required. Examples: "Regular", "Family", "Honorary".
- familyAffiliation (string): optional, memberNumber of head-of-family for family members.

Validation rules
- memberNumber must be exactly 6 digits; leading zeros permitted. Must be unique.
- firstName and lastName must be non-empty strings.
- email, if present, must match basic email format.
- phone, if present, should be sanitized and stored as provided.
- familyAffiliation, if present, must reference an existing memberNumber.

Role-based access
- Read access: any authenticated user (or optionally public GET if desired).
- Write access (create, update, delete): ONLY users with roles: President, MembershipChair, Treasurer.
- The repository JSON file is the single source of truth. All writes must be committed to the repo.

Concurrency and commits
- The backend must read the file (including SHA), apply the change, and use create/update file API with the correct SHA.
- If commit fails because SHA changed, the backend should retry (fetch latest file, reapply change, reattempt) up to a small retry limit (3).
- For high-volume or multi-writer workflows, prefer a branch+PR model instead of direct commits.

Audit and traceability
- All commits should include metadata in the commit message: action, memberNumber(s), and acting username.
- Optionally maintain an audit log file or external DB recording timestamp, actor, action, and diff.

APIs
- The API contract is defined in `api/openapi.yaml`.

Acceptance criteria
- Only authorized roles can perform write operations; attempts by other roles are rejected with 403.
- memberNumber uniqueness enforced.
- familyAffiliation references validated.
- All changes are visible in the repository file and have meaningful commit messages.
