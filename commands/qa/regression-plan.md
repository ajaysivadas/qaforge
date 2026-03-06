---
name: qa:regression-plan
description: Generate a regression test plan by analyzing code changes, identifying impacted areas, and prioritizing what to retest.
---

# QA Regression Planning

Analyze changes and produce an impact-based regression test plan.

## Input

$ARGUMENTS

If no argument is provided, ask the user for:
- PR link, branch name, or description of changes
- Release scope
- Target environment

## Knowledge Base

Read before generating:
- `~/.claude/qaforge-knowledge/standards/coverage-criteria.md` — priority definitions, coverage targets
- `~/.claude/qaforge-knowledge/standards/test-structure.md` — test categorization (smoke, regression, integration)

## Instructions

### Step 1: Identify Changes

**If PR or branch:**
```bash
gh pr diff <PR_NUMBER> --name-only
```

**If release scope described**, map to affected services.

### Step 2: Map Impact Using Service Dependencies

Analyze the project's architecture to understand service dependencies. Look for:
- Direct dependencies (service A calls service B)
- Data dependencies (shared databases, caches, message queues)
- Configuration dependencies (shared config, feature flags)

If the project has a CLAUDE.md with a dependency graph, use it. Otherwise, infer from the codebase.

### Step 3: Find Existing Test Suites

Search the project for test suites covering impacted areas:
- TestNG suite XMLs in `test-suite/`
- Maven profiles in `pom.xml`
- pytest test modules in `tests/`
- Playwright test specs

### Step 4: Prioritize into Tiers

| Tier | Criteria | When to Run |
|------|----------|-------------|
| **P0** | Directly tests changed code | Before merge |
| **P1** | Tests direct dependencies | Before deployment |
| **P2** | Tests indirect dependencies | After deployment |
| **P3** | Smoke for unrelated services | Nightly |

### Step 5: Generate Plan

```markdown
# Regression Plan

**Release:** <description>
**Date:** <YYYY-MM-DD>
**Risk Level:** HIGH / MEDIUM / LOW

## Change Summary
| File | Service | Impact |
|------|---------|--------|

## Execution Plan

### P0 — Must Run (Before Merge)
| Suite | Command | Est. Time | Covers |
|-------|---------|-----------|--------|

### P1 — High Risk (Before Deployment)
| Suite | Command | Est. Time | Covers |
|-------|---------|-----------|--------|

### P2 — Medium Risk (After Deployment)
| Suite | Command | Est. Time | Covers |
|-------|---------|-----------|--------|

## Manual Testing Required
- [ ] <scenario>

## Sign-off Checklist
- [ ] P0 passed
- [ ] P1 passed
- [ ] No blocker/critical issues
```

### Step 6: Save

Write to `doc/regression-plans/<name>-<YYYY-MM-DD>.md`. Report file path.
