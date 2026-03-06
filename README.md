<div align="center">

# QA Forge

### Context-engineered QA workflows for Claude Code

[![npm version](https://img.shields.io/npm/v/qaforge?color=cb3837&label=npm&logo=npm&logoColor=white)](https://www.npmjs.com/package/qaforge)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Claude Code](https://img.shields.io/badge/Claude_Code-compatible-6B4FBB?logo=anthropic&logoColor=white)](https://claude.ai/claude-code)

Test plans, scaffolding, bug investigation, and more from a single `/qa` command.

[Quick Start](#-quick-start) &bull; [Commands](#-commands) &bull; [How It Works](#-how-it-works) &bull; [Docs](#-documentation)

</div>

---

QA Forge installs intelligent slash commands into [Claude Code](https://claude.ai/claude-code). It ships with a curated knowledge base of **16 files** across 6 frameworks that guides Claude to generate test plans, scaffold automation code, investigate bugs, detect flaky tests, and more — all following your project's exact patterns.

<br>

## Quick Start

```bash
npx qaforge
```

Then in Claude Code:

```
/qa:test-plan user registration flow with OAuth
/qa:api-scaffold POST /v1/orders
/qa:bug-investigate TimeoutException in checkout regression
```

That's it. Three commands, zero config.

<br>

## Installation

```bash
# Global — available in all projects (recommended)
npx qaforge --global

# Local — only this project + auto-scan
npx qaforge --local

# Default — global install + scan current project
npx qaforge
```

<details>
<summary><b>Management commands</b></summary>

```bash
npx qaforge --verify      # Check installation integrity
npx qaforge --list        # Show installed commands & knowledge
npx qaforge --uninstall   # Clean removal
npx qaforge --verbose     # Debug output
```

</details>

<br>

## Commands

### Planning & Analysis

| Command | What it does |
|:--------|:-------------|
| `/qa:test-plan` | Generate a full test strategy from a feature, PR, or user story |
| `/qa:test-cases` | Produce structured positive, negative, edge, and boundary cases |
| `/qa:regression-plan` | Analyze code changes and build a prioritized regression plan |
| `/qa:coverage-gap` | Find untested endpoints, screens, and missing scenarios |

### Code Generation

| Command | What it does |
|:--------|:-------------|
| `/qa:api-scaffold` | Scaffold API tests — executors, POJOs, test classes, suite XML |
| `/qa:app-scaffold` | Scaffold mobile tests — screen objects, UI flows, suite XML |
| `/qa:test-data` | Generate test data — JSON, DataProviders, DB fixtures, CSV |

### Investigation

| Command | What it does |
|:--------|:-------------|
| `/qa:bug-investigate` | Root cause analysis from logs, Allure reports, or stack traces |
| `/qa:flaky-detect` | Detect flaky tests, classify across 10 patterns, suggest fixes |

> Each command has a detailed guide in [`docs/commands/`](docs/commands/README.md)

<br>

## How It Works

```
You type:                          QA Forge reads:                      Claude generates:
┌──────────────────┐    ┌──────────────────────────┐    ┌──────────────────────┐
│                  │    │  Knowledge Base (16 files)│    │                      │
│  /qa:<command>   │───>│  Project Context (.md)    │───>│  Code / Plans /      │
│  <your input>    │    │  Your Codebase (src/)     │    │  Reports             │
│                  │    │  CLAUDE.md (if exists)     │    │                      │
└──────────────────┘    └──────────────────────────┘    └──────────────────────┘
```

1. **Install** — Commands go to `~/.claude/commands/qa/`, knowledge to `~/.claude/qaforge-knowledge/`
2. **Scan** — Auto-detect your framework and generate `.claude/qaforge-context.md`
3. **Execute** — Type `/qa:<command>` in Claude Code. It reads knowledge + context + your actual code
4. **Output** — Code, plans, or reports that follow your exact framework patterns

<br>

## Project Scanning

```bash
npx qaforge --scan
```

Auto-detects from your project root:

| Detected | How |
|:---------|:----|
| **Framework** | `pom.xml`, `build.gradle`, `requirements.txt`, `pyproject.toml`, `package.json` |
| **Test runner** | TestNG, JUnit, pytest, Jest, Vitest, Playwright, Cypress |
| **Libraries** | RestAssured, Appium, Selenide, Supertest, httpx |
| **Test inventory** | File counts by language across `src/test`, `tests`, `__tests__`, `spec` |
| **CI/CD** | GitHub Actions, GitLab CI, Jenkins, CircleCI |
| **Maven profiles** | Extracted from `<profile>` blocks in `pom.xml` |

<br>

## Knowledge Base

The knowledge base is what makes QA Forge outputs framework-specific instead of generic. Each file contains real code patterns, naming conventions, and best practices.

<table>
<tr>
<td width="33%" valign="top">

**Frameworks** (6)
- `testng-restassured.md`
- `appium-selenide.md`
- `pytest.md`
- `playwright.md`
- `jest.md`
- `cypress.md`

</td>
<td width="33%" valign="top">

**Patterns** (7)
- `api-testing.md`
- `mobile-testing.md`
- `data-validation.md`
- `flaky-test-patterns.md`
- `graphql-testing.md`
- `websocket-testing.md`
- `network-mocking.md`

</td>
<td width="34%" valign="top">

**Standards** (3)
- `test-naming.md`
- `test-structure.md`
- `coverage-criteria.md`

</td>
</tr>
</table>

Installed to `~/.claude/qaforge-knowledge/` and referenced by commands at execution time.
See [Knowledge Base Architecture](docs/architecture/knowledge-base.md) for details.

<br>

## Supported Frameworks

| Framework | Language | Ecosystem | Status |
|:----------|:---------|:----------|:------:|
| TestNG + RestAssured | Java 17 | Maven, Allure | ![Full](https://img.shields.io/badge/-Full_Support-2ea44f) |
| Appium + Selenide | Java 17 | Maven, Allure | ![Full](https://img.shields.io/badge/-Full_Support-2ea44f) |
| pytest | Python 3.x | pip, Allure | ![Full](https://img.shields.io/badge/-Full_Support-2ea44f) |
| Playwright | TypeScript/JS | npm, Allure | ![Full](https://img.shields.io/badge/-Full_Support-2ea44f) |
| Jest | JavaScript/TS | npm, Supertest | ![Full](https://img.shields.io/badge/-Full_Support-2ea44f) |
| Cypress | JavaScript | npm | ![Full](https://img.shields.io/badge/-Full_Support-2ea44f) |

<br>

## Common Workflows

<details>
<summary><b>New Feature Testing</b></summary>

```
/qa:test-plan user registration with email and OAuth    # 1. Plan
/qa:test-cases user registration                        # 2. Cases
/qa:api-scaffold POST /v1/users                         # 3. Code
/qa:test-data User model                                # 4. Data
```

</details>

<details>
<summary><b>Release Preparation</b></summary>

```
/qa:regression-plan PR #142                             # 1. What to retest
/qa:coverage-gap users-service                          # 2. Find gaps
/qa:flaky-detect last 20 CI runs                        # 3. Flaky tests
```

</details>

<details>
<summary><b>Debugging a Failure</b></summary>

```
/qa:bug-investigate TimeoutException in OrderServiceTest
```

</details>

<br>

## Documentation

| | Document | Description |
|:--|:---------|:------------|
| **Start** | [Getting Started](docs/guides/getting-started.md) | First-time setup and walkthrough |
| **Use** | [Command Reference](docs/commands/README.md) | Detailed guide for every command |
| **Understand** | [Architecture](docs/architecture/README.md) | How QA Forge is designed |
| **Extend** | [Knowledge Base](docs/architecture/knowledge-base.md) | How the "training" works |
| **Contribute** | [Contributing](CONTRIBUTING.md) | Add commands, knowledge, frameworks |
| **History** | [Changelog](CHANGELOG.md) | Version history |

<br>

## Troubleshooting

<details>
<summary><b>Commands don't appear in Claude Code</b></summary>

```bash
npx qaforge --verify    # Check what's missing
npx qaforge --global    # Reinstall
```

</details>

<details>
<summary><b>Scanner doesn't detect my framework</b></summary>

Run from the project root where your build file (`pom.xml`, `package.json`, etc.) lives:

```bash
cd ~/your-project
npx qaforge --scan --verbose
```

</details>

<details>
<summary><b>Generated code doesn't match my patterns</b></summary>

Add a `CLAUDE.md` to your project root with your conventions. QA Forge commands read it automatically for project-specific guidance.

</details>

<details>
<summary><b>Need to start fresh</b></summary>

```bash
npx qaforge --uninstall && npx qaforge
```

</details>

<br>

## Limitations

- **Requires [Claude Code](https://claude.ai/claude-code)** — QA Forge is a command pack, not a standalone test runner
- **Knowledge is guidance** — Claude uses the knowledge base as context. Always review generated output
- **No runtime execution** — Generates code and plans, doesn't run tests
- **File-based detection** — Scanner looks for build files in the current directory only

<br>

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add new commands, extend the knowledge base, or add framework support.

<br>

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">
<sub>Built for QA engineers who ship quality fast.</sub>
</div>
