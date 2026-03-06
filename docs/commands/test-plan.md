# /qa:test-plan

Generate a comprehensive test plan for a feature, PR, or user story.

## Usage

```
/qa:test-plan <feature description, PR link, or requirement>
```

## Examples

```
/qa:test-plan user registration with email verification
/qa:test-plan https://github.com/org/repo/pull/42
/qa:test-plan new payment processing endpoint for Stripe integration
/qa:test-plan shopping cart checkout flow with discount codes
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

## Tips for Best Results

- **Be specific**: "user registration with email verification and MFA" is better than "test registration"
- **Provide PR links**: The command can read the diff and generate targeted plans
- **Run from the project directory**: So it can scan existing tests for gap analysis
- **Run `npx qaforge --scan` first**: Generates project context that improves output quality
