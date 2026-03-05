---
name: qa:test-plan
description: Generate a comprehensive test plan for a feature, PR, or user story. Analyzes requirements and produces structured test strategy with coverage mapping.
---

# QA Test Plan Generator

Analyze the given feature/PR/requirement and produce a structured test plan.

## Input

$ARGUMENTS

If no argument is provided, ask the user for:
- Feature name or PR link or requirement description
- Target service(s)
- Environment (stage/prod)

## Knowledge Base

Before generating the plan, read the following knowledge files if they exist:
- `~/.claude/qa-pilot-knowledge/standards/coverage-criteria.md` — coverage levels and checklists
- `~/.claude/qa-pilot-knowledge/patterns/api-testing.md` — API test design patterns
- `~/.claude/qa-pilot-knowledge/patterns/mobile-testing.md` — mobile test patterns
- `~/.claude/qa-pilot-knowledge/patterns/data-validation.md` — data pipeline patterns

Also check for project context:
- `.claude/qa-pilot-context.md` — auto-generated project context

## Instructions

### Step 1: Understand the Feature

If a GitHub PR link is provided:
```bash
gh pr view <PR_NUMBER> --json title,body,files,commits
gh pr diff <PR_NUMBER>
```

If a feature description is provided, analyze it directly.

Identify:
- What functionality is being added/changed
- Which services/modules are affected
- What data flows are involved
- What existing tests might be impacted

### Step 2: Detect Project Framework

Check the current directory for:
- `pom.xml` -> Java/Maven (check for TestNG, RestAssured, Appium, Selenide)
- `requirements.txt` / `pytest.ini` -> Python/pytest
- `package.json` -> Node.js (check for Mocha, Jest, Playwright, Cypress)
- `build.gradle` -> Gradle

Read the relevant framework knowledge file from `~/.claude/qa-pilot-knowledge/frameworks/` to understand the test structure and conventions.

### Step 3: Analyze Existing Test Coverage

Search the relevant test directories for existing tests covering the affected area.

Use the coverage criteria from the knowledge base to identify what's already covered and what gaps exist.

### Step 4: Generate Test Plan

Apply the coverage criteria standards to produce the test plan:

```markdown
# Test Plan: <Feature Name>

**Date:** <YYYY-MM-DD>
**Services Affected:** <list>
**Framework:** <detected framework>
**Risk Level:** HIGH / MEDIUM / LOW
**Estimated Test Cases:** <count>
**Coverage Target:** Level 1 (Smoke) / Level 2 (Functional) / Level 3 (Comprehensive)

## Scope

### In Scope
- <what will be tested>

### Out of Scope
- <what won't be tested and why>

## Test Strategy

### API Testing
| # | Scenario | Type | Priority | Endpoint | Expected Result |
|---|----------|------|----------|----------|-----------------|
| 1 | ... | Positive | P0 | ... | ... |

### UI/App Testing (if applicable)
| # | Scenario | Type | Priority | Screen/Flow | Expected Result |
|---|----------|------|----------|-------------|-----------------|

### Data Validation (if applicable)
| # | Scenario | Type | Priority | Data Source | Validation |
|---|----------|------|----------|-------------|------------|

## Test Categories

### Positive Tests (Happy Path)
- <list>

### Negative Tests (Error Handling)
- <list>

### Edge Cases
- <list>

### Boundary Tests
- <list>

### Integration Tests
- <list of cross-service validations>

## Pre-requisites
- <environment setup>
- <test data needs>
- <service dependencies>

## Regression Impact
- <existing tests that need re-verification>
- <areas that might break>

## Coverage Gap Analysis
- <what existing tests already cover>
- <what new tests are needed>
- <what manual testing is still required>

## Execution Plan
| Suite | Command | Est. Time |
|-------|---------|-----------|
| <suite> | `<run command>` | ~Xm |
```

### Step 5: Save the Test Plan

Write the plan to `doc/test-plans/<feature-name>-<YYYY-MM-DD>.md` in the current project directory. Create the directory if it doesn't exist.

Report the file path to the user.
