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

Read these knowledge files before generating:
- `~/.claude/qa-pilot-knowledge/standards/test-naming.md` — naming conventions
- `~/.claude/qa-pilot-knowledge/standards/coverage-criteria.md` — what to cover
- `~/.claude/qa-pilot-knowledge/patterns/api-testing.md` — request validation matrix

Also check project context: `.claude/qa-pilot-context.md`

## Instructions

### Step 1: Analyze the Requirement

Break down the input into:
- **Functional requirements**: What the system should do
- **Non-functional requirements**: Performance, security, data integrity
- **Business rules**: Conditions, validations, limits
- **Data flows**: Input -> Processing -> Output

### Step 2: Detect Framework

Check current directory for framework (pom.xml, requirements.txt, package.json).
Read the matching framework knowledge file from `~/.claude/qa-pilot-knowledge/frameworks/`.

### Step 3: Generate Test Cases

Apply the API testing request validation matrix from the knowledge base. For each requirement, generate test cases across all dimensions:

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

### Step 4: Generate Equivalence Classes & Boundary Table

```markdown
## Equivalence Partitioning

| Parameter | Valid Classes | Invalid Classes |
|-----------|-------------|-----------------|
| <param> | <valid ranges/values> | <invalid ranges/values> |

## Boundary Values

| Parameter | Min | Min+1 | Nominal | Max-1 | Max | Below Min | Above Max |
|-----------|-----|-------|---------|-------|-----|-----------|-----------|
```

### Step 5: Map to Automation Framework

Using the framework knowledge, suggest the exact code structure:

**For Java/TestNG**: Class name, annotations, method signatures following the naming standards
**For Python/pytest**: Test function names, fixtures, parametrize decorators
**For Playwright**: Test describe blocks, page object references

### Step 6: Save

Write to `doc/test-cases/<feature-name>-<YYYY-MM-DD>.md`. Create directory if needed. Report file path.
