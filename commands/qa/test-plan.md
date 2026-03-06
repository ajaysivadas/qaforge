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

1. Read `~/.claude/qaforge-knowledge/INDEX.md` to determine which files to load
2. Read `~/.claude/qaforge-knowledge/standards/coverage-criteria.md` (always needed for planning)
3. Based on detected framework and feature type, read ONLY the matching files from the index — do NOT read all knowledge files
4. Read `.claude/qaforge-context.md` and project `CLAUDE.md` if they exist

## Instructions

### Step 1: Understand the Feature

If a GitHub PR link is provided:
```bash
gh pr view <PR_NUMBER> --json title,body,files,commits
gh pr diff <PR_NUMBER>
```

If a feature description is provided (no PR link):
1. Use Glob to find related source files: `Glob("**/*<feature-keyword>*")`
2. Use Grep to search for related code: `Grep("<feature-keyword>", "src/")`
3. Read the most relevant files to understand the feature's implementation

If the PR link fails or returns an error, ask the user for a feature description instead.

Identify and list:
- **Functionality**: What is being added/changed (specific endpoints, screens, or business logic)
- **Services affected**: Which modules/services are modified (list file paths)
- **Data flows**: Input sources -> Processing steps -> Output/storage
- **Existing test impact**: Use Grep to find tests referencing the affected code: `Grep("<class-or-function-name>", "src/test/")` or `Grep("<class-or-function-name>", "tests/")`

### Step 2: Detect Project Framework

Check the current directory for:
- `pom.xml` -> Java/Maven (check for TestNG, RestAssured, Appium, Selenide)
- `requirements.txt` / `pytest.ini` -> Python/pytest
- `package.json` -> Node.js (check for Mocha, Jest, Playwright, Cypress)
- `build.gradle` -> Gradle

Read the relevant framework knowledge file from `~/.claude/qaforge-knowledge/frameworks/` to understand the test structure and conventions.

### Step 3: Confirm Scope (Checkpoint)

Before generating the full plan, present a brief summary to the user:
- Feature understood as: <1-2 sentence summary>
- Services affected: <list>
- Framework detected: <name>
- Estimated complexity: Simple (5-10 cases) / Medium (10-20 cases) / Complex (20-35 cases)

Ask: "Does this look correct? Any areas to add or exclude?"

### Step 4: Analyze Existing Test Coverage

Search test directories for existing tests covering the affected area:
- Java: `Glob("src/test/**/*<ServiceName>*Test.java")`
- Python: `Glob("tests/**/*test_<feature>*.py")`
- JS/TS: `Glob("**/*.test.{ts,js}")` or `Glob("**/*.spec.{ts,js}")`

Use the coverage criteria from the knowledge base to identify what's already covered and what gaps exist.

### Step 5: Generate Test Plan

Apply the coverage criteria standards to produce the test plan.

**Output size guide:** Aim for 10-25 test scenarios. Cap at 35 for complex multi-service features. If a plan exceeds 35 scenarios, split into sub-plans by service.

**Populating the template:** Each `<placeholder>` below maps to analysis from earlier steps. Fill every field — do not leave angle-bracket placeholders in the output.

```markdown
# Test Plan: <Feature Name>

**Date:** <YYYY-MM-DD>
**Services Affected:** <list>
**Framework:** <detected framework>
**Risk Level:** HIGH / MEDIUM / LOW
**Estimated Test Cases:** <count>
**Coverage Target:** Level 1 (Smoke) / Level 2 (Functional) / Level 3 (Comprehensive)

> **Risk Level Criteria:**
> - **HIGH**: Changes to payment, auth, data mutation, or multi-service flows; OR changes to >5 files across >2 services
> - **MEDIUM**: Changes to single-service business logic, new endpoints, or schema changes
> - **LOW**: Config changes, copy/label updates, test-only changes, or logging additions
>
> **Coverage Target Decision:**
> - HIGH risk -> Level 3 (Comprehensive): all categories including security and performance
> - MEDIUM risk -> Level 2 (Functional): positive + negative + key edge cases
> - LOW risk -> Level 1 (Smoke): positive happy-path only

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

### Step 6: Save the Test Plan

Write the plan to `doc/test-plans/<feature-name>-<YYYY-MM-DD>.md` in the current project directory. Create the directory if it doesn't exist.

Report the file path to the user.
