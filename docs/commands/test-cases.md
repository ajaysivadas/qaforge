# /qa:test-cases

Generate detailed test cases from a feature description, test plan, or user story.

## Usage

```
/qa:test-cases <feature or scenario description>
```

## Examples

```
/qa:test-cases Trade idea creation with iron condor strategy
/qa:test-cases Login screen validation for Android and iOS
/qa:test-cases Backtest trade comparison for NIFTY weekly
/qa:test-cases Account service onboarding flow
```

## What It Does

1. **Breaks down the requirement** into functional, non-functional, and business rules
2. **Detects your framework** and reads framework-specific knowledge
3. **Generates test cases** across all dimensions:
   - **Positive** — happy path with valid data
   - **Negative** — invalid inputs, missing fields, wrong types
   - **Edge** — min/max values, special characters, empty inputs
   - **Boundary** — at exact limits, just below/above limits
4. **Creates equivalence partitioning table** and **boundary value table**
5. **Maps to your automation framework** — suggests exact class names, method signatures, annotations

## Output Format

Each test case includes:
- Type (Positive/Negative/Edge/Boundary)
- Priority (P0-P3)
- Pre-conditions
- Test data
- Step-by-step procedure
- Expected result
- API details (method, endpoint, payload, expected status)
- Automation notes (framework-specific hints)

Saved to `doc/test-cases/<feature-name>-<YYYY-MM-DD>.md`

## Tips

- Specify the test type focus ("API tests for order placement") for more targeted output
- Reference specific endpoints or screens for precise test data suggestions
- Combine with `/qa:test-data` to generate the actual data for the test cases
