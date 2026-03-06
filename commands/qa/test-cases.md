---
name: qa:test-cases
description: Generate detailed test cases from a feature description, test plan, or user story. Produces structured positive, negative, edge, and boundary cases.
---

# QA Test Case Generator

Generate comprehensive test cases for the given feature or scenario.

## Input

$ARGUMENTS

If no argument is provided, ask the user for:
- Feature/scenario description
- Test type focus (API, UI, Data, or All)
- Target service

## Knowledge Base

1. Read `~/.claude/qaforge-knowledge/INDEX.md` to determine which files to load
2. Read `~/.claude/qaforge-knowledge/standards/coverage-criteria.md` (always needed)
3. Based on detected framework and feature type (API, mobile, GraphQL, etc.), read ONLY the matching pattern and framework files from the index
4. Read `.claude/qaforge-context.md` and project `CLAUDE.md` if they exist

## Instructions

### Step 1: Analyze the Requirement

If a PR link is provided, fetch details:
```bash
gh pr view <PR_NUMBER> --json title,body,files
```
If a feature description is provided, use Grep/Glob to find relevant source files:
- `Grep("<feature-keyword>", "src/")` to locate implementation
- `Glob("**/*<feature-keyword>*")` to find related files

If the input is ambiguous or too broad, ask the user: "Can you narrow the scope to a specific endpoint, screen, or business rule?"

Break down the input into:
- **Functional requirements**: What the system should do (list specific behaviors)
- **Non-functional requirements**: Performance, security, data integrity
- **Business rules**: Conditions, validations, limits (extract exact thresholds/ranges from code)
- **Data flows**: Input -> Processing -> Output (identify each field and its constraints)

### Step 2: Detect Framework

Check current directory for framework (pom.xml, requirements.txt, package.json).
Read the matching framework knowledge file from `~/.claude/qaforge-knowledge/frameworks/`.

### Step 3: Confirm Scope (Checkpoint)

Before generating, present to the user:
- Requirements identified: <count>
- Estimated test cases: <count> (target 15-25 cases; cap at 40 for complex features)
- Framework: <detected>
- Focus: API / UI / Data / All

Ask: "Proceed with generation, or adjust scope?"

### Step 4: Generate Test Cases

For each requirement, generate test cases across all dimensions. Use the coverage criteria from the knowledge base to ensure completeness:
- **Per GET endpoint**: valid params, pagination, filtering, sorting, auth, 404, empty results
- **Per POST endpoint**: valid payload, each required field missing, invalid types, duplicate, auth
- **Per UI screen**: element visibility, interactions, navigation, error states, responsive

**Priority assignment rules:**
- **P0**: Core happy-path functionality; blocking if it fails (login, create, payment)
- **P1**: Important negative cases and key business rules (validation, auth errors)
- **P2**: Edge cases, boundary values, non-critical flows
- **P3**: Cosmetic, UX, or low-probability scenarios

```markdown
# Test Cases: <Feature Name>

**Total Cases:** <count>
**Positive:** <count> | **Negative:** <count> | **Edge:** <count> | **Boundary:** <count>

---

## TC-001: <Test Case Title>
- **Type:** Positive / Negative / Edge / Boundary
- **Priority:** P0 / P1 / P2 / P3
- **Pre-conditions:** <setup required>
- **Test Data:** <specific data values>
- **Steps:**
  1. <step>
  2. <step>
- **Expected Result:** <what should happen>
- **API Details** (if applicable):
  - Method: GET/POST/PUT/DELETE
  - Endpoint: <path>
  - Payload: ```json { ... } ```
  - Expected Status: <code>
- **Automation Notes:** <framework-specific implementation hints>
```

### Step 5: Generate Equivalence Classes & Boundary Table

```markdown
## Equivalence Partitioning

| Parameter | Valid Classes | Invalid Classes |
|-----------|-------------|-----------------|
| <param> | <valid ranges/values> | <invalid ranges/values> |

## Boundary Values

| Parameter | Min | Min+1 | Nominal | Max-1 | Max | Below Min | Above Max |
|-----------|-----|-------|---------|-------|-----|-----------|-----------|
```

### Step 6: Map to Automation Framework

Using the framework knowledge, suggest the exact code structure:

**For Java/TestNG**: Class name, annotations, method signatures following the naming standards
**For Python/pytest**: Test function names, fixtures, parametrize decorators
**For Playwright**: Test describe blocks, page object references

### Step 7: Save

Write to `doc/test-cases/<feature-name>-<YYYY-MM-DD>.md`. Create directory if needed. Report file path.
