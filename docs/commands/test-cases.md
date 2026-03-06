# /qa:test-cases

Generate detailed test cases from a feature description, test plan, or user story.

## Usage

```
/qa:test-cases <feature or scenario description>
```

## Examples

```
/qa:test-cases user login with email, Google OAuth, and MFA
/qa:test-cases shopping cart add/remove/update quantities
/qa:test-cases payment processing with credit card and PayPal
/qa:test-cases file upload with size limits and type validation
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

## Output

Saved to `doc/test-cases/<feature-name>-<YYYY-MM-DD>.md`

## Tips

- Specify the test type focus ("API tests for order placement") for more targeted output
- Reference specific endpoints or screens for precise test data suggestions
- Combine with `/qa:test-data` to generate the actual data for the test cases
