# Security Policy

## Supported Versions

Only the latest minor release of `nyxis-ui` is actively supported with security
updates. Older versions may receive critical fixes at the maintainer's
discretion.

| Version | Supported          |
| ------- | ------------------ |
| 0.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Nyxis, **please do not open a public
GitHub issue**. Instead, report it privately so we can fix it before it is
exploited.

- Email: **security@juliodaal.dev** (or `juliocesar.daal@gmail.com` while the
  dedicated address is being set up)
- Subject line: `[SECURITY] Nyxis – <short summary>`
- Include: a description of the issue, reproduction steps, affected versions,
  and any proof-of-concept code if applicable.

## Response Timeline

| Step                         | Target   |
| ---------------------------- | -------- |
| Acknowledgement of report    | 72 hours |
| Initial assessment           | 7 days   |
| Fix released (high/critical) | 30 days  |
| Public disclosure            | 90 days  |

We follow a coordinated disclosure model: a CVE will be requested where
appropriate, and reporters will be credited in the changelog unless they prefer
to remain anonymous.

## Out of Scope

The following are intentionally out of scope and will not be treated as
vulnerabilities:

- Issues only reproducible on outdated browsers (browsers without ES2022
  support).
- Self-XSS that requires the victim to paste attacker-controlled code into their
  own console or app.
- Denial of service through resource exhaustion in the consumer's own app.
- Vulnerabilities in third-party dependencies that have a public fix available —
  please bump the dependency rather than report.

## Hardening Practices

The Nyxis repository enforces the following baseline:

- Strict Content-Security-Policy on the deployed docs site.
- HSTS, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Content-Type-Options: nosniff`, and a restrictive `Permissions-Policy`.
- CodeQL static analysis on every push and pull request.
- Dependabot security updates enabled.
- `pnpm audit --audit-level=high` blocking in CI.
- Gitleaks secret scanning pre-commit and in CI.
- Signed npm releases via npm provenance (OIDC).
- Branch protection on `main` requiring green CI and code review.
