# /qa:flaky-detect

Detect and analyze flaky tests from Allure reports, CI history, or test execution patterns.

## Usage

```
/qa:flaky-detect <Allure report URL, CI pipeline link, or test suite name>
```

## Examples

```
/qa:flaky-detect https://allure.example.com/projects/orders-stage
/qa:flaky-detect checkout regression suite - last 20 runs
/qa:flaky-detect authentication tests on CI
```

## What It Does

1. **Gathers test history** from Allure reports or CI systems (GitHub Actions, GitLab CI, etc.)
2. **Identifies flaky tests** using detection heuristics
3. **Classifies root cause** against 10 known patterns:

| # | Pattern | Typical Fix |
|---|---------|-------------|
| 1 | Timing / Race condition | Add explicit waits, poll for state |
| 2 | Test data dependency | Isolate test data, use fixtures |
| 3 | Shared state / ThreadLocal | ThreadLocal variables, proper cleanup |
| 4 | External service dependency | Retry logic, service health checks |
| 5 | Date/time dependent | Use relative dates, mock time |
| 6 | Order-dependent tests | Explicit dependencies, independent setup |
| 7 | Resource contention | Dynamic ports, unique data per thread |
| 8 | Stale cache | Clear cache in setup |
| 9 | Network flakiness | Connection pooling, retry with backoff |
| 10 | Element staleness (mobile) | Re-locate elements (method pattern, not fields) |

4. **Provides specific code fixes** for each flaky test

## Output

Saved to `doc/flaky-reports/<project>-<YYYY-MM-DD>.md`

## Tips

- Multiple reports give better flakiness signals than a single run
- Works best when Allure history is available (shows trends across runs)
