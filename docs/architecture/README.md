# Architecture Overview

QA Forge is a context-engineering system for Claude Code. It's not a traditional test framework — it's a set of prompt templates (commands) backed by a curated knowledge base that guides Claude Code to produce high-quality, framework-specific QA artifacts.

## System Design

```
qaforge/
  bin/install.js          # CLI entry point — installs and scans
  commands/qa/*.md        # Slash command prompts (9 commands)
  knowledge/              # "Training" data (11 files)
    frameworks/           # Code patterns per framework
    patterns/             # QA best practices
    standards/            # Naming, structure, coverage rules
  scripts/scan-project.js # Project scanner
```

## How Commands Execute

When a user types `/qa:test-plan user registration flow` in Claude Code:

1. Claude Code loads the command file (`commands/qa/test-plan.md`)
2. The command instructs Claude to read specific knowledge files
3. Claude reads the knowledge files for patterns and standards
4. Claude reads `.claude/qaforge-context.md` for project-specific context
5. Claude reads the project's `CLAUDE.md` for framework-specific rules
6. Claude reads actual source code (existing tests, executors, page objects)
7. Claude generates output following all the patterns it absorbed

This is **context engineering** — the quality of output depends on the quality and specificity of the context provided to Claude.

## Component Roles

### CLI (`bin/install.js`)

- Copies command files to `~/.claude/commands/qa/` (global) or `.claude/commands/qa/` (local)
- Copies knowledge files to `~/.claude/qaforge-knowledge/`
- Scans projects to generate `.claude/qaforge-context.md`
- Zero runtime dependencies — pure Node.js fs operations

### Commands (`commands/qa/*.md`)

Each command is a markdown file with:
- **Frontmatter** — name and description (used by Claude Code's skill system)
- **$ARGUMENTS** — placeholder for user input
- **Knowledge Base section** — lists which knowledge files to read (with `MUST READ` directives)
- **Instructions** — step-by-step workflow for Claude to follow
- **Output template** — structured format for the generated artifact

### Knowledge Base (`knowledge/`)

Three categories:

| Category | Purpose | Files |
|----------|---------|-------|
| `frameworks/` | Exact code patterns, class structures, naming rules | testng-restassured, appium-selenide, pytest, playwright |
| `patterns/` | QA methodology, test design patterns, anti-patterns | api-testing, mobile-testing, data-validation, flaky-test-patterns |
| `standards/` | Naming conventions, file organization, coverage criteria | test-naming, test-structure, coverage-criteria |

### Project Scanner

The scanner (`--scan` flag) auto-detects:
- Build tool (Maven, pip, npm, Gradle)
- Test framework (TestNG, pytest, Mocha, Jest, Playwright)
- Dependencies (RestAssured, Appium, Allure, etc.)
- Test file count by language
- Maven profiles (if pom.xml exists)
- CI/CD configuration
- Presence of CLAUDE.md

## Design Decisions

### Why markdown command files, not code?

Claude Code's slash command system reads markdown files. The prompts ARE the product.

### Why a separate knowledge base?

Commands stay concise. Knowledge is referenced via `Read` — Claude loads it on demand.

### Why scan projects?

Auto-detection eliminates the need for users to explain their tech stack every time.

### Why global install?

Most users work across multiple projects with the same frameworks. Global install means `/qa:*` commands work everywhere. Project scanning adds project-specific context on top.
