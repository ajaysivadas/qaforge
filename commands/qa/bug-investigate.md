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

**MUST READ** before investigating:
- `~/.claude/qa-pilot-knowledge/patterns/flaky-test-patterns.md` — known flaky patterns and fixes
- The relevant framework file from `~/.claude/qa-pilot-knowledge/frameworks/` — to understand code structure

## Instructions

### Step 1: Collect Evidence

**If Allure report URL is provided:**
Use the analyze-allure workflow to fetch failure details.

**If error/stack trace is provided:**
Parse the error type, message, and origin. Identify the failing class/method/line.

**If logs are provided or a log path is given:**
Read the relevant log sections.

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

Cross-reference against the flaky test patterns knowledge base:

**Common Marketfeed failures:**
- `NoHttpResponseException` — service overloaded (has retry, 5 attempts)
- `PreRequisiteValidator` failure — Redis missing option chain data or GCP services down
- `System.exit(0)` in listener — pre-req check failed
- `NoSuchElementException` — element not found, check locator
- `StaleElementReferenceException` — screen transitioned
- BigQuery timeout — large dataset
- Redis state stale — container not restarted
- PubSub message not received — topic/subscription mismatch

### Step 4: Trace Root Cause

1. **What failed?** — exact assertion or error
2. **Where did it fail?** — service, endpoint, screen, step
3. **What was expected vs actual?** — specific mismatch
4. **What changed?** — recent deployments, config changes
5. **Is it reproducible?** — check history

Read the failing test code and its dependencies to understand the full call chain.

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
