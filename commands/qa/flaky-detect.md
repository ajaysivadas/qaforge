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

Try data sources in this priority order. Use the first one that succeeds:

**Priority 1 — Allure report (most detailed):**
If an Allure URL is provided, check if the `/qa:analyze-allure` slash command is available and use it.
If not available, try: `curl -s "<allure-url>/api/report" | jq '.testCases[] | select(.status == "failed" or .status == "broken")'`
If curl fails (auth, unreachable), move to Priority 2.

**Priority 2 — GitHub Actions CI history:**
```bash
gh run list --limit 20 --json databaseId,conclusion,startedTime
```
For failed runs, drill into test results:
```bash
gh run view <RUN_ID> --json jobs --jq '.jobs[] | select(.conclusion == "failure") | .name'
```

**Priority 3 — GitLab CI or other CI:**
Check for CI config: `Glob("**/.gitlab-ci.yml")` or `Glob("**/Jenkinsfile")` or `Glob("**/.circleci/config.yml")`
Use the appropriate CLI tool based on what's found.

**Priority 4 — Local test results:**
Search for test result files: `Glob("**/surefire-reports/*.xml")` or `Glob("**/test-results/**/*.xml")` or `Glob("**/junit-*.xml")`
Parse XML results to find tests with mixed pass/fail history.

**If none of the above produces data:**
Ask the user: "I couldn't find test history automatically. Can you provide a test result file, CI URL, or paste the names of tests you suspect are flaky?"

### Step 2: Identify Flaky Tests

Apply these detection heuristics from the knowledge base:
- **Pass rate 60-95%** across multiple runs (passes sometimes, fails sometimes)
- **Different error messages** across failures of the same test
- **Passes on retry** without any code changes
- **No code change correlates** with failure onset (check `git log` around first failure date)

For each candidate, calculate:
| Test Name | Runs | Passes | Fails | Pass Rate | Flaky? |
|-----------|------|--------|-------|-----------|--------|

### Step 3: Classify Root Cause

Match each flaky test against the 10 known patterns. For each, read the test code to confirm:

| # | Pattern | How to Detect | Key Indicator in Code |
|---|---------|--------------|----------------------|
| 1 | Timing/Race condition | `Thread.sleep`, `setTimeout`, hard-coded waits | Missing explicit waits or synchronization |
| 2 | Test data dependency | Test assumes specific data exists | No setup/teardown, relies on shared DB state |
| 3 | Shared state / ThreadLocal | Tests pass alone, fail in parallel | Static mutable variables, shared collections |
| 4 | External service dependency | Timeout errors, connection refused | Real HTTP calls without mocks |
| 5 | Date/time dependent | Fails at month boundaries, midnight | `new Date()`, `LocalDate.now()` without injection |
| 6 | Order-dependent | Fails when run in different order | Depends on side effects from other tests |
| 7 | Resource contention | Port already in use, file locked | Shared ports, temp files without unique names |
| 8 | Stale cache | Old data returned | Redis/Memcached without flush in setup |
| 9 | Network flakiness | DNS resolution, socket timeout | Tests hitting real external endpoints |
| 10 | Element staleness (mobile/web) | `StaleElementReferenceException` | Element looked up once, used after page transition |

Read the test source code: `Grep("<test-method-name>", "src/test/")` to find and analyze each flaky test.

### Step 4: Generate Report

**Output size guide:** Focus on actionable fixes. Limit to top 10 flakiest tests. For each, provide the specific fix from the knowledge base.

```markdown
# Flaky Test Analysis

**Date:** <YYYY-MM-DD>
**Data Source:** <Allure / GitHub Actions / Local results>
**Tests Analyzed:** <count>
**Flaky Tests Found:** <count>
**Flakiness Rate:** <percentage>

## Detail per Flaky Test
### <Test Name>
- **Pass Rate:** X% (Y passes / Z runs)
- **Pattern:** <which of the 10 patterns>
- **Root Cause:** <1-2 sentence explanation>
- **Evidence:** <specific line or behavior observed>
- **Fix:**
  ```<language>
  // Before (flaky)
  <current code>

  // After (stable)
  <fixed code>
  ```

## Quick Wins (fix in <30 min each)
1. <test> — <fix summary>

## Needs Investigation (requires deeper analysis)
1. <test> — <what to investigate>

## Prevention Rules
- <pattern-specific prevention rule from knowledge base>
```

### Step 5: Save

Write to `doc/flaky-reports/<project-or-suite>-<YYYY-MM-DD>.md`. Report the top 3 flakiest tests to the user.
