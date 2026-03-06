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

1. Read `~/.claude/qaforge-knowledge/INDEX.md` to determine which files to load
2. Read `~/.claude/qaforge-knowledge/standards/coverage-criteria.md` and `standards/test-structure.md`
3. Skip framework and pattern files — regression planning doesn't need code patterns
4. Read project `CLAUDE.md` if it exists — dependency graphs are especially useful here

## Instructions

### Step 1: Identify Changes

**If PR or branch:**
```bash
gh pr diff <PR_NUMBER> --name-only
```

**If release scope described**, map to affected services.

### Step 2: Map Impact Using Service Dependencies

Analyze the project's architecture to understand service dependencies.

**If CLAUDE.md exists and has a dependency graph**, use it as the primary source.

**If no dependency graph is available**, build one from the code:
1. `Grep("import.*<changed-class>", "src/")` — find files that import changed code
2. `Grep("@FeignClient\\|RestTemplate\\|WebClient\\|httpx\\|requests\\.get\\|fetch(", "src/")` — find service-to-service calls
3. `Grep("@Table\\|@Entity\\|model\\|schema", "src/")` — find shared data models
4. `Glob("**/application*.yml")` or `Glob("**/config*")` — find shared configuration

Categorize dependencies:
- **Direct**: Files that import or call the changed code
- **Data**: Services sharing the same database tables, caches, or queues
- **Config**: Services sharing feature flags or configuration values

### Step 3: Confirm Scope (Checkpoint)

Present to the user before generating the full plan:
- Changes detected: <count files, count services>
- Impact radius: <direct deps> direct, <indirect deps> indirect
- Risk assessment: HIGH / MEDIUM / LOW

> **Risk criteria:**
> - **HIGH**: Changes to auth, payments, data mutations, or >3 services affected
> - **MEDIUM**: Changes to single-service business logic or API contracts
> - **LOW**: Config, logging, test-only, or documentation changes

Ask: "Does this impact assessment look correct? Any services to add or exclude?"

### Step 4: Find Existing Test Suites

Search the project for test suites covering impacted areas:
- `Glob("**/test-suite/**/*.xml")` — TestNG suite XMLs
- `Grep("<profile>", "pom.xml")` — Maven profiles (if pom.xml exists)
- `Glob("tests/**/*test*.py")` — pytest test modules
- `Glob("**/*.spec.{ts,js}")` — Playwright/Jest test specs
- `Glob("**/cypress/e2e/**/*.cy.{ts,js}")` — Cypress specs

### Step 5: Prioritize into Tiers

| Tier | Criteria | When to Run |
|------|----------|-------------|
| **P0** | Directly tests changed code | Before merge |
| **P1** | Tests direct dependencies | Before deployment |
| **P2** | Tests indirect dependencies | After deployment |
| **P3** | Smoke for unrelated services | Nightly |

### Step 6: Generate Plan

**Output size guide:** Keep the plan actionable. Aim for 5-15 suites across all tiers. If more than 15, consolidate related suites.

**Populating the template:** Fill every `<placeholder>` with actual values from previous steps. Do not leave angle-bracket placeholders in the output.

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

### Step 7: Save

Write to `doc/regression-plans/<name>-<YYYY-MM-DD>.md`. Report file path.
