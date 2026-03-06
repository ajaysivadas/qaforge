# QA Forge

> Context-engineered QA workflows for Claude Code — test plans, scaffolding, bug investigation, and more from a single `/qa` command.

QA Forge is a CLI tool that installs intelligent slash commands into [Claude Code](https://claude.com/claude-code). It ships with a curated QA knowledge base that guides Claude to generate test plans, scaffold automation code, investigate bugs, detect flaky tests, and more — all following your project's exact patterns and conventions.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Commands](#commands)
- [Project Scanning](#project-scanning)
- [Knowledge Base](#knowledge-base)
- [Supported Frameworks](#supported-frameworks)
- [How It Works](#how-it-works)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Quick Start

```bash
# Install globally (works across all projects)
npx qaforge

# Then in Claude Code, type:
/qa:test-plan user registration flow
/qa:api-scaffold POST /v1/orders
/qa:bug-investigate TimeoutException in checkout regression
```

## Installation

### Global Install (Recommended)

Installs commands to `~/.claude/commands/qa/` so they're available in every project.

```bash
npx qaforge --global
```

### Local Install

Installs to the current project's `.claude/` directory. Also scans the project and generates context.

```bash
npx qaforge --local
```

### Interactive

Installs globally and scans the current project.

```bash
npx qaforge
```

### Verify Installation

```bash
npx qaforge --version
npx qaforge --help
```

## Commands

| Command | Description | Docs |
|---------|-------------|------|
| `/qa:test-plan` | Generate test strategy from features, PRs, or requirements | [Guide](docs/commands/test-plan.md) |
| `/qa:test-cases` | Generate detailed test cases (positive, negative, edge, boundary) | [Guide](docs/commands/test-cases.md) |
| `/qa:api-scaffold` | Scaffold API test suite (executor, POJOs, test class, suite XML) | [Guide](docs/commands/api-scaffold.md) |
| `/qa:app-scaffold` | Scaffold mobile app tests (screen objects, test class, suite XML) | [Guide](docs/commands/app-scaffold.md) |
| `/qa:bug-investigate` | Root cause analysis from failures, logs, or stack traces | [Guide](docs/commands/bug-investigate.md) |
| `/qa:regression-plan` | Impact-based regression plan from code changes | [Guide](docs/commands/regression-plan.md) |
| `/qa:test-data` | Generate test data (JSON, DataProviders, DB fixtures, cache, CSV) | [Guide](docs/commands/test-data.md) |
| `/qa:flaky-detect` | Detect flaky tests, classify root causes, suggest fixes | [Guide](docs/commands/flaky-detect.md) |
| `/qa:coverage-gap` | Find untested endpoints, screens, and missing scenarios | [Guide](docs/commands/coverage-gap.md) |

## Project Scanning

```bash
npx qaforge --scan
```

Generates `.claude/qaforge-context.md` with auto-detected:
- Framework (Maven/TestNG, pytest, Playwright, etc.)
- Test inventory (file counts by language)
- Maven profiles / pytest markers
- CI/CD configuration
- Dependencies

Run this inside each project directory for best results.

## Knowledge Base

QA Forge ships with a curated knowledge base — this is what "trains" the commands to produce high-quality, framework-specific output instead of generic responses.

```
knowledge/
  frameworks/        # Exact code patterns for each framework
    testng-restassured.md
    appium-selenide.md
    pytest.md
    playwright.md
    jest.md
    cypress.md
  patterns/          # QA best practices and anti-patterns
    api-testing.md
    mobile-testing.md
    data-validation.md
    flaky-test-patterns.md
    graphql-testing.md
    websocket-testing.md
    network-mocking.md
  standards/         # Naming, structure, and coverage rules
    test-naming.md
    test-structure.md
    coverage-criteria.md
```

Installed to `~/.claude/qaforge-knowledge/` and referenced by commands at execution time. See [Knowledge Base Architecture](docs/architecture/knowledge-base.md) for details.

## Supported Frameworks

| Framework | Language | Tools | Status |
|-----------|----------|-------|--------|
| TestNG + RestAssured | Java 17 | Maven, Allure | Full support |
| Appium + Selenide | Java 17 | Maven, Allure | Full support |
| pytest | Python 3.x | Allure | Full support |
| Playwright | TypeScript/JS | npm, Allure | Full support |
| Jest | JavaScript/TS | npm, Supertest | Full support |
| Cypress | JavaScript | npm | Full support |

## How It Works

```
                                    +------------------+
                                    |  Your Codebase   |
                                    | (CLAUDE.md, src) |
                                    +--------+---------+
                                             |
+----------------+    +-----------+    +-----v------+    +------------+
| /qa:<command>  | -> | Knowledge | -> | Claude Code| -> | Generated  |
| (slash command)|    | Base (16  |    | (reads all |    | Code/Plans |
|                |    |  files)   |    |  context)  |    | /Reports   |
+----------------+    +-----------+    +-----+------+    +------------+
                                             |
                                    +--------+---------+
                                    | Project Context  |
                                    | (qaforge-context|
                                    |  .md from scan)  |
                                    +------------------+
```

1. **Install** -- Commands go to `~/.claude/commands/qa/`, knowledge to `~/.claude/qaforge-knowledge/`
2. **Scan** -- Auto-detect project framework and generate `.claude/qaforge-context.md`
3. **Execute** -- Type `/qa:<command>` in Claude Code. It reads knowledge + context + your actual code
4. **Output** -- Generates code, plans, or reports following your exact framework patterns

## Documentation

| Document | Description |
|----------|-------------|
| [Getting Started Guide](docs/guides/getting-started.md) | First-time setup and walkthrough |
| [Command Reference](docs/commands/README.md) | Detailed guide for every command |
| [Architecture Overview](docs/architecture/README.md) | How QA Forge is designed |
| [Knowledge Base](docs/architecture/knowledge-base.md) | How the "training" works |
| [Contributing Guide](CONTRIBUTING.md) | How to add commands and knowledge |
| [Changelog](CHANGELOG.md) | Version history |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to:
- Add new commands
- Extend the knowledge base
- Add support for new frameworks
- Submit improvements

## License

MIT -- see [LICENSE](LICENSE) for details.
