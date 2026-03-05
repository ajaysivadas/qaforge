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

**MUST READ:**
- `~/.claude/qa-pilot-knowledge/standards/coverage-criteria.md` — per-endpoint checklists, coverage levels, metrics targets

## Instructions

### Step 1: Inventory Existing Tests

Scan the project. For each test, map:
- What endpoint/screen/feature it covers
- What type of test it is (positive, negative, edge)
- Its priority level

### Step 2: Inventory What Should Be Tested

Using the coverage criteria checklists:
- **GET endpoints**: 8-point checklist
- **POST endpoints**: 8-point checklist
- **PUT/PATCH endpoints**: 7-point checklist
- **DELETE endpoints**: 5-point checklist
- **Screens**: 10-point checklist
- **Data pipelines**: 7-point checklist

### Step 3: Calculate Gaps

For each endpoint/screen, compare existing tests against the checklist.

### Step 4: Generate Report

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
- **What's Missing:** ...
- **Risk:** ...
- **Suggested Tests:** ...

## Recommendations
1. Immediate: ...
2. Sprint goal: ...
3. Backlog: ...
```

### Step 5: Save

Write to `doc/coverage-reports/<scope>-<YYYY-MM-DD>.md`. Report top 3 gaps.
