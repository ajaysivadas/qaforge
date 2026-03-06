# /qa:bug-investigate

Investigate test failures or bugs using logs, Allure reports, error messages, or stack traces.

## Usage

```
/qa:bug-investigate <error message, stack trace, or failure description>
```

## Examples

```
/qa:bug-investigate TimeoutException in checkout regression suite
/qa:bug-investigate java.lang.AssertionError: expected 200 but got 500 in CreateOrderTest
/qa:bug-investigate StaleElementReferenceException in LoginScreenTest on iOS
/qa:bug-investigate Data comparison test failing - no records found after pipeline run
/qa:bug-investigate https://allure.example.com/projects/orders-stage
```

## What It Does

1. **Collects evidence** — reads stack traces, fetches Allure reports, reads log files
2. **Classifies the failure** into one of 6 categories:
   - Test Bug, Product Bug, Environment Issue, Data Issue, Flaky Test, Infrastructure
3. **Checks against 10 known flaky patterns** from the knowledge base
4. **Traces root cause** through the code
5. **Generates an investigation report** with root cause, evidence, and resolution steps

## Output

Saved to `doc/bug-reports/<name>-<YYYY-MM-DD>.md`

## Tips

- Paste the full stack trace for best results
- Provide the Allure report URL to pull structured failure data
- Mention the environment (stage/prod) for context-aware diagnosis
