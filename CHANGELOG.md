# Changelog

All notable changes to QA Forge will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.2.0] - 2026-03-06

### Changed

#### Prompt engineering — 9 improvements across all 9 commands
- **Concrete tool instructions**: Replaced vague verbs like "analyze" and "scan" with specific Glob/Grep patterns (e.g., `Glob("src/test/**/*Test.java")`, `Grep("@Test", "<file>")`)
- **Fallback instructions**: Every input branch now has a fallback path (e.g., "If curl fails, ask the user to paste the failure details manually")
- **Decision criteria**: Added explicit rules for risk levels (HIGH/MEDIUM/LOW), priority assignment (P0-P3), and coverage targets (Level 1-3)
- **Template population instructions**: Added "Fill every field — do not leave angle-bracket placeholders in the output" to all template sections
- **Consistent depth**: Leveled up weaker commands (coverage-gap, regression-plan) to match api-scaffold quality with concrete search patterns and structured gap calculation
- **Inlined external references**: Replaced undefined "analyze-allure workflow" reference in bug-investigate with concrete fallback chain
- **Fixed step ordering**: app-scaffold now runs cross-platform analysis (Step 3) BEFORE code generation (Step 5), not after
- **Output size control**: All commands now have output size guidance (e.g., "target 15-25 cases; cap at 40")
- **Mid-process checkpoints**: All commands now confirm scope with the user before generating (e.g., "Does this look correct? Any areas to add or exclude?")

---

## [1.1.0] - 2026-03-06

### Added

#### Knowledge Base — 5 new files (11 → 16 total)
- `frameworks/jest.md` — mocking, Supertest API testing, data-driven tests, snapshots, matchers
- `frameworks/cypress.md` — custom commands, page objects, `cy.intercept`, network interception, config
- `patterns/graphql-testing.md` — query/mutation/error testing, pagination, validation matrix
- `patterns/websocket-testing.md` — connection lifecycle, send/receive, subscriptions, async patterns
- `patterns/network-mocking.md` — Playwright routes, Cypress intercept, WireMock, pytest responses/httpx
- `knowledge/INDEX.md` — routing table for conditional knowledge loading

#### CLI — 4 new commands
- `--uninstall` — clean removal of commands and knowledge from `~/.claude/` and `./.claude/`
- `--verify` — check installation integrity, report missing command files (9/9 validation)
- `--list` — show all installed commands with descriptions and knowledge files
- `--verbose` — debug output showing every file copy, directory creation, and framework detection

#### Scanner — expanded detection
- Gradle projects (`build.gradle`)
- Python `pyproject.toml` and `setup.py`
- `@playwright/test` (npm package name)
- Vitest, Supertest, httpx detection
- `__tests__/` directory scanning

#### Documentation
- Troubleshooting table in README (5 common issues)
- Limitations section in README
- Common Workflows section with collapsible examples
- Redesigned README with badges, grouped command tables, visual hierarchy

### Changed

#### Token optimization — ~40% fewer tokens per command
- Commands now use `INDEX.md` to conditionally load only the relevant knowledge files
- Before: every command loaded 5-9 files upfront (~6,000-7,000 tokens)
- After: commands load INDEX (~235 tokens), detect framework, read only what's needed
- `/qa:api-scaffold`: 7,100 → 2,550 tokens (64% reduction)
- `/qa:test-plan`: 6,300 → 3,250 tokens (48% reduction)

#### Command improvements
- All 9 commands now reference `CLAUDE.md` (was missing from 5 commands)
- `/qa:test-data` expanded from 66 → 160+ lines with schema tables, all framework formats (Java/Python/JS/SQL/CSV), security test data guidance, PII handling rules
- `/qa:api-scaffold` now references Jest, Cypress, Playwright framework files
- `/qa:app-scaffold` screenshot instruction clarified (Read tool can view images)
- `/qa:regression-plan` explicitly skips unneeded framework/pattern files

#### Knowledge base updates
- `frameworks/playwright.md` — added network interception, visual regression, multi-browser config, key rules, project structure (120 → 195 lines)
- `patterns/data-validation.md` — removed trading-specific patterns (OHLC, signals, backtests), replaced with generic record comparison, JSON schema validation, date/time validation
- All 6 frameworks now listed as "Full support"

#### npm packaging
- Added `files` field — tarball only includes essential files (26 files, 31.6 kB)
- Added `.npmignore` — excludes docs, .git, dev files
- Added `homepage` and `bugs` URLs
- Expanded keywords from 10 → 18 for npm discoverability
- Removed `postinstall` script that auto-installed globally without user consent

### Fixed

- **Maven profile regex** — was extracting ALL `<id>` tags (groupId, artifactId, etc.), now only extracts `<id>` inside `<profile>` blocks
- **File I/O error handling** — `ensureDir`, `copyDir`, `countFiles` now have try-catch with user-friendly messages instead of raw Node.js crashes
- **`--auto` flag removed** — no longer installs globally as a side effect of `npm install`

### Refactored
- Three duplicate install code blocks consolidated into single `installTo()` function
- Hardcoded paths extracted into constants (`COMMANDS_DIR`, `KNOWLEDGE_DIR`, `CONTEXT_FILE`)
- Command descriptions stored in single `COMMANDS` array (source of truth for help, list, verify)
- Added `safeWriteFile()`, `removeDir()`, `removeFile()`, `listFiles()` utility functions

---

## [1.0.0] - 2026-03-05

### Added

#### Commands (9)
- `/qa:test-plan` — Generate test strategy from features, PRs, or requirements
- `/qa:test-cases` — Generate detailed test cases (positive, negative, edge, boundary)
- `/qa:api-scaffold` — Scaffold API test suite (executor, POJOs, test class, TestNG suite XML, Maven profile)
- `/qa:app-scaffold` — Scaffold mobile app tests (screen objects, test class, TestNG suite XML)
- `/qa:bug-investigate` — Root cause analysis from failures, logs, or stack traces
- `/qa:regression-plan` — Impact-based regression plan from code changes
- `/qa:test-data` — Generate test data (JSON, DataProviders, DB fixtures, cache, CSV)
- `/qa:flaky-detect` — Detect flaky tests, classify against 10 known patterns, suggest fixes
- `/qa:coverage-gap` — Find untested endpoints, screens, and missing test scenarios

#### Knowledge Base (11 files)
- **Frameworks**: TestNG+RestAssured, Appium+Selenide, pytest, Playwright
- **Patterns**: API testing matrix, mobile testing checklist, data validation, 10 flaky test patterns
- **Standards**: Test naming conventions, test structure rules, coverage criteria checklists

#### CLI
- `npx qaforge` — Install globally + scan current project
- `npx qaforge --global` — Install to ~/.claude/
- `npx qaforge --local` — Install to ./.claude/ with project scan
- `npx qaforge --scan` — Scan project and generate context file
- `npx qaforge --help` — Show usage
- `npx qaforge --version` — Show version

#### Project Scanner
- Auto-detects: Maven/TestNG, pytest, Node.js frameworks
- Extracts Maven profiles from pom.xml
- Counts test files by language
- Detects CI/CD configuration (GitHub Actions, GitLab CI, Jenkins, CircleCI)
- Detects CLAUDE.md presence

#### Documentation
- README with quick start guide
- Command reference (9 individual command docs)
- Architecture overview and knowledge base architecture
- Getting started guide
- Contributing guide
- MIT License
