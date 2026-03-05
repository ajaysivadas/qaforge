# Architecture Overview

QA Pilot is a context-engineering system for Claude Code. It's not a traditional test framework — it's a set of prompt templates (commands) backed by a curated knowledge base that guides Claude Code to produce high-quality, framework-specific QA artifacts.

## System Design

```
qa-pilot/
  bin/install.js          # CLI entry point — installs and scans
  commands/qa/*.md        # Slash command prompts (9 commands)
  knowledge/              # "Training" data (11 files)
    frameworks/           # Code patterns per framework
    patterns/             # QA best practices
    standards/            # Naming, structure, coverage rules
  scripts/scan-project.js # Project scanner
```

## How Commands Execute

When a user types `/qa:test-plan TAP order placement` in Claude Code:

1. Claude Code loads the command file (`commands/qa/test-plan.md`)
2. The command instructs Claude to read specific knowledge files
3. Claude reads the knowledge files for patterns and standards
4. Claude reads `.claude/qa-pilot-context.md` for project-specific context
5. Claude reads the project's `CLAUDE.md` for framework-specific rules
6. Claude reads actual source code (existing tests, executors, POJOs)
7. Claude generates output following all the patterns it absorbed

This is **context engineering** — the quality of output depends on the quality and specificity of the context provided to Claude.

## Component Roles

### CLI (`bin/install.js`)

- Copies command files to `~/.claude/commands/qa/` (global) or `.claude/commands/qa/` (local)
- Copies knowledge files to `~/.claude/qa-pilot-knowledge/`
- Scans projects to generate `.claude/qa-pilot-context.md`
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
| `frameworks/` | Exact code patterns, class structures, naming rules | testng-restassured.md, appium-selenide.md, pytest.md, playwright.md |
| `patterns/` | QA methodology, test design patterns, anti-patterns | api-testing.md, mobile-testing.md, data-validation.md, flaky-test-patterns.md |
| `standards/` | Naming conventions, file organization, coverage criteria | test-naming.md, test-structure.md, coverage-criteria.md |

### Project Scanner

The scanner (`--scan` flag) auto-detects:
- Build tool (Maven, pip, npm, Gradle)
- Test framework (TestNG, pytest, Mocha, Jest, Playwright)
- Dependencies (RestAssured, Appium, Allure, etc.)
- Test file count by language
- Maven profiles (if pom.xml exists)
- CI/CD configuration
- Presence of CLAUDE.md

Output goes to `.claude/qa-pilot-context.md` — a lightweight summary that commands reference.

## Installation Flow

```
npx qa-pilot --global
       |
       v
  Read commands/qa/*.md
       |
       v
  Copy to ~/.claude/commands/qa/
       |
       v
  Read knowledge/**/*.md
       |
       v
  Copy to ~/.claude/qa-pilot-knowledge/
       |
       v
  Done. Commands available in Claude Code.
```

## Design Decisions

### Why markdown command files, not code?

Claude Code's slash command system reads markdown files. The prompts ARE the product. Code is only needed for installation and scanning.

### Why a separate knowledge base?

Commands need to stay concise (Claude has a limit on command file size for responsiveness). The knowledge base is referenced via `Read` — Claude loads it on demand, keeping command files focused on workflow.

### Why scan projects?

Auto-detection eliminates the need for users to explain their tech stack. The context file is small (~50 lines) but gives commands enough signal to choose the right framework patterns.

### Why global install?

Most users work across multiple projects with the same frameworks. Global install means `/qa:*` commands work everywhere. Project scanning (`--scan`) adds project-specific context on top.
