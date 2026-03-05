# /qa:flaky-detect

Detect and analyze flaky tests from Allure reports, CI history, or test execution patterns.

## Usage

```
/qa:flaky-detect <Allure report URL, CI pipeline link, or test suite name>
```

## Examples

```
/qa:flaky-detect http://34.47.166.104:7474/allure-docker-service-ui/projects/tap-stage
/qa:flaky-detect TAP regression suite - last 20 runs
/qa:flaky-detect signal-generation-stage project
```

## What It Does

1. **Gathers test history** from Allure reports or GitHub Actions
2. **Identifies flaky tests** using detection heuristics:
   - Pass rate 60-95% across runs
   - Different error messages across failures
   - Passes on retry without code changes
   - No code change correlates with failure onset
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

4. **Provides specific code fixes** for each flaky test based on its pattern

## Output

Saved to `doc/flaky-reports/<project>-<YYYY-MM-DD>.md`

Includes:
- Flakiness rate and summary
- Per-test detail: failure rate, pattern, root cause, code fix
- Quick wins (easy fixes)
- Needs investigation (requires more data)

## Tips

- Provide Allure report URLs for the richest data (failure messages, retry info)
- Multiple reports give better flakiness signals than a single run
- Works best when Allure history is available (shows trends across runs)
