---
name: qa:flaky-detect
description: Detect and analyze flaky tests from Allure reports, CI history, or test execution patterns. Identifies root causes and suggests fixes.
---

# QA Flaky Test Detection & Analysis

Identify flaky tests and analyze their failure patterns.

## Input

$ARGUMENTS

If no argument is provided, ask the user for:
- Allure report URL, CI pipeline link, or test suite name
- Time range to analyze

## Knowledge Base

1. Read `~/.claude/qaforge-knowledge/patterns/flaky-test-patterns.md` (critical for classification)
2. Skip framework, standards, and other pattern files — not needed for flaky detection
3. Read project `CLAUDE.md` if it exists — for Allure credentials and CI config

## Instructions

### Step 1: Gather Test History

**From Allure report (if URL provided):**
If the project has an Allure Docker Service, authenticate and fetch report data. Check the project's CLAUDE.md or config for Allure credentials and API endpoint.

**From GitHub Actions:**
```bash
gh run list --limit 20 --json databaseId,conclusion,startedTime
```

**From GitLab CI or other CI:**
Check for CI config files and use appropriate CLI tools.

### Step 2: Identify Flaky Tests

Using the detection heuristics from the knowledge base:
- Pass rate 60-95% across runs
- Different error messages across failures
- Passes on retry without code changes
- No code change correlates with failure onset

### Step 3: Classify Root Cause

Match each flaky test against the 10 patterns:
1. Timing/Race condition
2. Test data dependency
3. Shared state / ThreadLocal
4. External service dependency
5. Date/time dependent
6. Order-dependent
7. Resource contention
8. Stale cache
9. Network flakiness
10. Element staleness (mobile)

Provide the specific fix from the knowledge base for each.

### Step 4: Generate Report

```markdown
# Flaky Test Analysis

**Date:** <YYYY-MM-DD>
**Flaky Tests Found:** <count>
**Flakiness Rate:** <percentage>

## Detail per Flaky Test
### <Test Name>
- **Failure Rate:** X%
- **Pattern:** <which of the 10 patterns>
- **Root Cause:** <explanation>
- **Fix:**
  ```<language>
  // Specific code fix
  ```

## Quick Wins
1. <easy fixes>

## Needs Investigation
1. <needs more data>
```

### Step 5: Clean Up and Save

Clean temp files. Write to `doc/flaky-reports/<project>-<YYYY-MM-DD>.md`.
