---
name: qa:coverage-gap
description: Analyze test coverage gaps by comparing existing tests against API endpoints, app screens, or business requirements. Identifies untested areas.
---

# QA Coverage Gap Analysis

Identify what's tested and what's missing.

## Input

$ARGUMENTS

If no argument is provided, ask the user for:
- What to analyze: a specific service, the full project, or a feature area
- Coverage dimension: API endpoints, app screens, business rules, or all

## Knowledge Base

1. Read `~/.claude/qaforge-knowledge/INDEX.md` to determine which files to load
2. Read `~/.claude/qaforge-knowledge/standards/coverage-criteria.md` (always needed)
3. Based on API type detected, read ONLY the matching pattern file (api-testing OR graphql-testing — not both unless both exist)
4. Read project `CLAUDE.md` if it exists

## Instructions

### Step 1: Inventory Existing Tests

Search the project for all test files using concrete tool calls:

**Java/TestNG:**
- `Glob("src/test/**/*Test.java")` — find all test classes
- For each test class, `Grep("@Test", "<file>")` to count test methods
- `Grep("@BeforeClass", "<file>")` to identify what endpoint/feature each test covers

**Python/pytest:**
- `Glob("tests/**/*test*.py")` — find all test files
- `Grep("def test_", "<file>")` to count and list test functions
- `Grep("@pytest.mark", "<file>")` to find markers and categories

**JS/TS (Jest/Playwright/Cypress):**
- `Glob("**/*.{test,spec}.{ts,js}")` — find all test files
- `Grep("test(\\|it(\\|describe(", "<file>")` to identify test blocks

For each test found, record:
| Test File | Endpoint/Screen/Feature | Test Type (positive/negative/edge) | Priority |
|-----------|------------------------|-----------------------------------|----------|

### Step 2: Inventory What Should Be Tested

**For API endpoints**, find all endpoints in the codebase:
- `Grep("@GetMapping\\|@PostMapping\\|@PutMapping\\|@DeleteMapping\\|@RequestMapping", "src/main/")` (Java Spring)
- `Grep("@app\\.route\\|@router\\.", "src/")` (Python Flask/FastAPI)
- `Grep("router\\.get\\|router\\.post\\|app\\.get\\|app\\.post", "src/")` (Express/Node.js)

**For app screens**, find all screen/page classes:
- `Glob("**/screens/*.java")` or `Glob("**/pages/*.{ts,js}")` or `Glob("**/components/*.{tsx,jsx}")`

Apply the coverage criteria checklists from the knowledge base:
- **GET endpoints**: valid params, pagination, filtering, sorting, auth, 404, empty result, caching (8 points)
- **POST endpoints**: valid create, each required field missing, invalid types, duplicate, auth, payload too large, concurrent (8 points)
- **PUT/PATCH endpoints**: valid update, partial update, non-existent resource, concurrent update, auth, immutable fields, no-change (7 points)
- **DELETE endpoints**: valid delete, non-existent, already deleted, auth, cascade effects (5 points)

### Step 3: Confirm Scope (Checkpoint)

Present to the user:
- Endpoints/screens found: <count>
- Existing tests found: <count>
- Initial coverage estimate: <percentage>

Ask: "Proceed with detailed gap analysis, or narrow scope to specific areas?"

### Step 4: Calculate Gaps

For each endpoint/screen, compare existing tests against the checklist:

1. Mark each checklist item as: **Covered** (test exists), **Partial** (test exists but incomplete), or **MISSING** (no test)
2. Calculate coverage percentage: `(covered items / total checklist items) * 100`
3. Flag any endpoint/screen with <50% coverage as a **Critical Gap**
4. Flag any endpoint/screen with 50-80% coverage as **Needs Improvement**

### Step 5: Generate Report

**Output size guide:** Focus on gaps, not what's already covered. Lead with critical gaps. Limit the report to the top 10 gaps if more than 10 exist.

**Populating the template:** Fill every `<placeholder>` with actual values. Do not leave angle-bracket placeholders in the output.

```markdown
# Coverage Gap Analysis

**Date:** <YYYY-MM-DD>
**Scope:** <what was analyzed>

## Summary
| Dimension | Covered | Total | % |
|-----------|---------|-------|---|

## Coverage by Service
### <Service>
| Endpoint/Screen | Tests | Positive | Negative | Edge | Status |
|----------------|-------|----------|----------|------|--------|
| ... | ... | ... | ... | ... | Covered/Partial/MISSING |

## Critical Gaps (P0)
### <Gap>
- **What's Missing:** <specific checklist items not covered>
- **Risk:** <what could go wrong if this is untested>
- **Suggested Tests:** <concrete test scenarios to add, with method names>

## Recommendations
1. **Immediate** (this sprint): <top 3 gaps with highest risk>
2. **Sprint goal**: <coverage target percentage to reach>
3. **Backlog**: <nice-to-have coverage improvements>
```

### Step 6: Save

Write to `doc/coverage-reports/<scope>-<YYYY-MM-DD>.md`. Report top 3 gaps to the user.
