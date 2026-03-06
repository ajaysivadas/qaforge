---
name: qa:bug-investigate
description: Investigate test failures or bugs using logs, Allure reports, error messages, or stack traces. Performs structured root cause analysis.
---

# QA Bug Investigation

Perform structured root cause analysis from test failures, logs, or error descriptions.

## Input

$ARGUMENTS

If no argument is provided, ask the user for:
- Error message, stack trace, or failure description
- Allure report URL (optional)
- Service name (optional)
- Environment (stage/prod)

## Knowledge Base

1. Read `~/.claude/qaforge-knowledge/INDEX.md` to determine which files to load
2. Read `~/.claude/qaforge-knowledge/patterns/flaky-test-patterns.md` (always needed for investigation)
3. Detect the project framework, then read ONLY the matching framework file from the index
4. Only read `patterns/network-mocking.md` if the failure involves external service calls or timeouts
5. Read project `CLAUDE.md` if it exists

## Instructions

### Step 1: Collect Evidence

Gather evidence from whatever sources are available. Try each in order of usefulness:

**If Allure report URL is provided:**
1. Check if the `/qa:analyze-allure` slash command is available (it may not be installed)
2. If available, use it to fetch structured failure data
3. If not available, fetch the report directly: `curl -s "<allure-url>/api/report" | jq '.failures'`
4. If curl fails (auth required, URL unreachable), ask the user to paste the failure details manually

**If error/stack trace is provided:**
Parse and extract:
- Error type (e.g., `AssertionError`, `NullPointerException`, `TimeoutError`)
- Error message (the human-readable part)
- Origin: failing class/method/line number
- Call chain: the stack frames leading to the failure

**If logs are provided or a log path is given:**
Read the log file with `Read("<path>")`. Search for:
- `Grep("ERROR\\|FATAL\\|Exception", "<log-path>")` to find error entries
- Timestamps around the failure window
- Correlation IDs or request IDs to trace the flow

**If none of the above is available:**
Ask the user: "Can you provide an error message, stack trace, log file path, or Allure report URL?"

### Step 2: Classify the Failure

| Category | Indicators |
|----------|-----------|
| **Test Bug** | Assertion error with wrong expected value, stale test data, missing setup |
| **Product Bug** | Unexpected response code, wrong data, business logic violation |
| **Environment Issue** | Connection timeout, service unavailable, DNS failure |
| **Data Issue** | Missing test data, expired data, data mismatch |
| **Flaky Test** | Intermittent failure, timing-dependent, race condition |
| **Infrastructure** | OOM, disk full, pod restart, deployment in progress |

### Step 3: Check Known Patterns

Cross-reference against the flaky test patterns knowledge base. Common failures include:
- `NoHttpResponseException` — service overloaded, needs retry logic
- Pre-requisite validation failures — dependent service or data store down
- `NoSuchElementException` — UI element not found, check locator strategy
- `StaleElementReferenceException` — screen transitioned, element reference stale
- Database/query timeouts — large dataset or slow query
- Cache state stale — service not restarted after config change
- Message queue delivery failure — topic/subscription mismatch

### Step 4: Trace Root Cause

1. **What failed?** — exact assertion or error
2. **Where did it fail?** — service, endpoint, screen, step
3. **What was expected vs actual?** — specific mismatch
4. **What changed?** — recent deployments, config changes
5. **Is it reproducible?** — check history

Read the failing test code and its dependencies to understand the full call chain:
1. `Grep("<failing-method-name>", "src/test/")` to find the test file
2. Read the test file to understand what it does
3. `Grep("<called-method>", "src/")` to trace into production code or API executors
4. Check recent changes: `git log --oneline -10 -- <failing-file>` to see if the file was recently modified

### Step 5: Generate Investigation Report

```markdown
# Bug Investigation Report

**Date:** <YYYY-MM-DD>
**Failure:** <brief description>
**Service:** <affected service>
**Category:** <Test Bug / Product Bug / Environment / Data / Flaky / Infra>

## Root Cause
<clear explanation>

## Evidence
- <specifics>

## Resolution
### Immediate Fix
<what to do now>

### Long-term Fix
<prevent recurrence>

### Code Changes
- [ ] <file and change>
```

### Step 6: Save Report

Write to `doc/bug-reports/<name>-<YYYY-MM-DD>.md`. Report findings to user.
