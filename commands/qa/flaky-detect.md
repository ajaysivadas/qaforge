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

**MUST READ** — this is critical for accurate classification:
- `~/.claude/qa-pilot-knowledge/patterns/flaky-test-patterns.md` — all 10 flaky patterns with detection heuristics and fixes

## Instructions

### Step 1: Gather Test History

**From Allure:** Authenticate and fetch report data with retries info.
```bash
curl -s -c /tmp/allure-cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"username":"viewer","password":"Mfeed@2023"}' \
  "http://<host>:5051/allure-docker-service/login" > /dev/null
```

**From GitHub Actions:**
```bash
gh run list --limit 20 --json databaseId,conclusion,startedTime
```

### Step 2: Identify Flaky Tests

Using the detection heuristics from the knowledge base:
- Pass rate 60-95% across runs
- Different error messages across failures
- Passes on retry
- No code change correlates

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
