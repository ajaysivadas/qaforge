# Changelog

All notable changes to QA Pilot will be documented in this file.

## [1.0.0] - 2026-03-05

### Added

#### Commands (9)
- `/qa:test-plan` — Generate test strategy from features, PRs, or requirements
- `/qa:test-cases` — Generate detailed test cases (positive, negative, edge, boundary)
- `/qa:api-scaffold` — Scaffold API test suite (executor, POJOs, test class, TestNG suite XML, Maven profile)
- `/qa:app-scaffold` — Scaffold mobile app tests (screen objects, test class, TestNG suite XML)
- `/qa:bug-investigate` — Root cause analysis from failures, logs, or stack traces
- `/qa:regression-plan` — Impact-based regression plan from code changes
- `/qa:test-data` — Generate test data (JSON, DataProviders, Firestore, Redis, CSV, BigQuery)
- `/qa:flaky-detect` — Detect flaky tests, classify against 10 known patterns, suggest fixes
- `/qa:coverage-gap` — Find untested endpoints, screens, and missing test scenarios

#### Knowledge Base (11 files)
- **Frameworks**: TestNG+RestAssured, Appium+Selenide, pytest, Playwright
- **Patterns**: API testing matrix, mobile testing checklist, data validation, 10 flaky test patterns
- **Standards**: Test naming conventions, test structure rules, coverage criteria checklists

#### CLI
- `npx qa-pilot` — Interactive install (global + project scan)
- `npx qa-pilot --global` — Install to ~/.claude/
- `npx qa-pilot --local` — Install to ./.claude/ with project scan
- `npx qa-pilot --scan` — Scan project and generate context file
- `npx qa-pilot --help` — Show usage
- `npx qa-pilot --version` — Show version

#### Project Scanner
- Auto-detects: Maven/TestNG, pytest, Node.js frameworks
- Extracts Maven profiles from pom.xml
- Counts test files by language
- Detects CI/CD configuration
- Detects CLAUDE.md presence

#### Documentation
- README with quick start guide
- Command reference (9 individual command docs)
- Architecture overview
- Knowledge base architecture
- Getting started guide
- Contributing guide
