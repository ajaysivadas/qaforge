# /qa:bug-investigate

Investigate test failures or bugs using logs, Allure reports, error messages, or stack traces.

## Usage

```
/qa:bug-investigate <error message, stack trace, or failure description>
```

## Examples

```
/qa:bug-investigate NoHttpResponseException in TAP regression suite
/qa:bug-investigate java.lang.AssertionError: expected 200 but got 500 in CreatingIronCondor
/qa:bug-investigate http://34.47.166.104:7474/allure-docker-service-ui/projects/tap-stage
/qa:bug-investigate StaleElementReferenceException in LoginScreenTest on iOS
/qa:bug-investigate Signal generation test failing - no signals in Firestore after PubSub publish
```

## What It Does

1. **Collects evidence** — reads stack traces, fetches Allure reports, reads log files
2. **Classifies the failure** into one of 6 categories:
   - Test Bug — wrong expected value, stale test data
   - Product Bug — unexpected behavior, business logic violation
   - Environment Issue — service unavailable, DNS failure
   - Data Issue — missing/expired test data
   - Flaky Test — intermittent, timing-dependent
   - Infrastructure — OOM, pod restart, deployment in progress
3. **Checks against known patterns** specific to the Marketfeed ecosystem:
   - `NoHttpResponseException` — service overloaded (5 retries built-in)
   - `PreRequisiteValidator` failure — Redis option chain or GCP services down
   - `System.exit(0)` — pre-req check killed the suite
   - Element staleness, BigQuery timeouts, Redis state issues, PubSub mismatches
4. **Traces root cause** through the code — reads the failing test, its dependencies, executors
5. **Generates an investigation report** with root cause, evidence, and resolution steps

## Output

Saved to `doc/bug-reports/<name>-<YYYY-MM-DD>.md`

Report includes:
- Failure summary and category
- Root cause analysis
- Evidence (code snippets, response bodies, log excerpts)
- Immediate fix
- Long-term fix to prevent recurrence
- Code changes checklist

## Tips

- Paste the full stack trace for best results
- Provide the Allure report URL to pull structured failure data
- Mention the environment (stage/prod) for context-aware diagnosis
