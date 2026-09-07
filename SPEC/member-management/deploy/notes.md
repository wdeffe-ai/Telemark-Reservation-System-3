Deployment & Security Notes

Secrets
- GITHUB_TOKEN (PAT) must be stored securely (environment variable, secret manager). It should have the minimum required scopes.
- JWT_SECRET must be strong and rotated periodically.

Repository
- The backend will commit directly to the file. For extra safety enable branch protections and consider requiring PRs from a bot/automation account.

Audit
- Keep an audit trail — either in-REPO `SPEC/member-management/audit.log` or an external logging service.

CI/CD
- Consider using GitHub Actions to run tests and lints on PRs. Do not expose the GITHUB_TOKEN in logs.
