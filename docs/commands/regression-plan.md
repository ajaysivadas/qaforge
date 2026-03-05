# /qa:regression-plan

Generate an impact-based regression test plan by analyzing code changes.

## Usage

```
/qa:regression-plan <PR link, branch name, or change description>
```

## Examples

```
/qa:regression-plan https://github.com/org/repo/pull/42
/qa:regression-plan feat/chasing-limit-changes
/qa:regression-plan TWS order execution logic changed, affects position management
/qa:regression-plan Bundle service payload structure updated
```

## What It Does

1. **Identifies changes** — reads PR diffs or branch changes
2. **Maps impact** using the service dependency graph:
   ```
   TAP -> TWS -> TMS, User PnL
   TAP -> Signal Accuracy, Mobile API, Bundle, TMS, TIS
   TIS -> Signal Accuracy, TMS
   Bundle -> TWS, TIS
   Mobile API -> TAP
   Quant Pipeline -> BigQuery, Firestore, Redis, PubSub
   SMD -> Backtest, Indicators, Options Data
   ```
3. **Finds existing test suites** covering impacted areas
4. **Prioritizes into tiers**:
   - **P0** — directly tests changed code (run before merge)
   - **P1** — tests direct dependencies (run before deployment)
   - **P2** — tests indirect dependencies (run after deployment)
   - **P3** — smoke for unrelated services (nightly)
5. **Generates execution plan** with exact Maven/pytest commands and time estimates

## Output

Saved to `doc/regression-plans/<name>-<YYYY-MM-DD>.md`

Includes:
- Change summary (file -> service -> impact mapping)
- Tiered execution plan with commands
- Manual testing checklist
- Sign-off checklist

## Tips

- Provide the PR link for automatic diff analysis
- Run from the project directory so it can find test suites
- Combine with `/qa:coverage-gap` to ensure no blind spots
