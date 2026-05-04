# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial repository scaffold: monorepo with `packages/ui` (publishable library)
  and `apps/docs` (Astro docs site).
- Security baseline: CSP headers, HSTS, CodeQL workflow, Dependabot config,
  Gitleaks pre-commit hook, branch protection requirements documented.
- Five-mode theming foundation (light, dark, dim, high-contrast, system).
- Continuous integration: lint, typecheck, unit tests, build, audit, secret
  scan.
- Release pipeline with Changesets and npm provenance.
