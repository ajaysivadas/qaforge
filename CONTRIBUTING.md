# Contributing to QA Pilot

## Overview

QA Pilot has three extensible layers:
1. **Commands** — slash command prompts in `commands/qa/`
2. **Knowledge Base** — curated QA expertise in `knowledge/`
3. **CLI** — installer and scanner in `bin/` and `scripts/`

## Adding a New Command

### 1. Create the command file

```bash
touch commands/qa/your-command.md
```

### 2. Follow this template

```markdown
---
name: qa:your-command
description: One-line description of what the command does.
---

# Command Title

Brief description.

## Input

$ARGUMENTS

If no argument is provided, ask the user for:
- Required input 1
- Required input 2

## Knowledge Base

**MUST READ** before executing:
- `~/.claude/qa-pilot-knowledge/<category>/<file>.md`

Also check: `.claude/qa-pilot-context.md`

## Instructions

### Step 1: <Action>
<What Claude should do>

### Step 2: <Action>
<What Claude should do>

### Step N: Save Output
Write to `doc/<category>/<name>-<YYYY-MM-DD>.md`. Report file path.
```

### 3. Key principles

- **Be directive**: Use "MUST READ", "Follow the exact patterns", "Do not improvise"
- **Reference knowledge**: Always point to specific knowledge files
- **Read before generating**: Commands should read existing code to match patterns
- **Structured output**: Use markdown templates for consistent output
- **Save artifacts**: Write output to `doc/` subdirectories

### 4. Test the command

```bash
# Reinstall
node bin/install.js --global

# Open Claude Code and test
/qa:your-command <test input>
```

## Extending the Knowledge Base

### Adding a new framework

Create `knowledge/frameworks/<framework>.md` with:

```markdown
# <Framework> Knowledge

## Test Class Structure
<Complete code example>

## Key Rules
1. <Rule>
2. <Rule>

## Package Structure
<Directory tree>

## Common Patterns
<Code examples>
```

Then update relevant commands to reference the new file.

### Adding a new pattern

Create `knowledge/patterns/<pattern>.md` with:

```markdown
# <Pattern> Patterns

## <Pattern Name>
**When to use**: <scenario>
**How to implement**: <code example>
**Anti-patterns**: <what not to do>
```

### Adding a new standard

Create `knowledge/standards/<standard>.md` with checklists, naming rules, or coverage criteria.

## Improving the Scanner

The scanner in `bin/install.js` (`scanAndGenerateContext()`) auto-detects project characteristics. To add detection for a new framework:

1. Add file existence check (e.g., `has<Framework>`)
2. Parse the build file for dependencies
3. Add relevant metadata to the context output

## Modifying the CLI

The CLI (`bin/install.js`) is intentionally simple — no external dependencies, pure Node.js. Keep it that way.

Key functions:
- `installCommands()` — copies command .md files
- `installKnowledge()` — copies knowledge .md files
- `scanAndGenerateContext()` — generates project context
- `main()` — argument parsing and orchestration

## Publishing Updates

```bash
# Bump version in package.json
# Update CHANGELOG.md
npm publish
```

Users update with:
```bash
npx qa-pilot@latest --global
```

## Code Style

- CLI: Standard Node.js, no external dependencies
- Commands: Markdown with frontmatter
- Knowledge: Markdown with code blocks matching the target framework
- No TypeScript, no build step, no bundler — keep it simple
