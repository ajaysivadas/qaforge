# /qa:test-plan

Generate a comprehensive test plan for a feature, PR, or user story.

## Usage

```
/qa:test-plan <feature description, PR link, or requirement>
```

## Examples

```
/qa:test-plan TAP order placement with chasing limit
/qa:test-plan https://github.com/org/repo/pull/42
/qa:test-plan New bundle creation endpoint for iron condor strategy
/qa:test-plan Signal generation for NIFTY weekly expiry
```

## What It Does

1. **Analyzes the feature** — parses PR diffs, reads feature descriptions, identifies affected services
2. **Detects your framework** — checks for pom.xml, requirements.txt, package.json to understand tech stack
3. **Scans existing tests** — finds what's already covered
4. **Generates a structured plan** with:
   - Scope (in/out)
   - Test strategy table (API, UI, Data validation)
   - Positive, negative, edge, boundary, and integration test scenarios
   - Pre-requisites and test data needs
   - Regression impact analysis
   - Coverage gap identification
   - Execution plan with commands and time estimates

## Output

Saved to `doc/test-plans/<feature-name>-<YYYY-MM-DD>.md`

## Knowledge Base References

- `coverage-criteria.md` — determines coverage levels and checklists
- `api-testing.md` — API test design patterns
- `mobile-testing.md` — mobile test verification checklist
- `data-validation.md` — data pipeline validation patterns

## Tips for Best Results

- **Be specific**: "TAP order placement with chasing limit for options" is better than "test TAP"
- **Provide PR links**: The command can read the diff and generate targeted plans
- **Run from the project directory**: So it can scan existing tests for gap analysis
- **Run `npx qa-pilot --scan` first**: Generates project context that improves output quality
