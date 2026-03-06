# Command Reference

QA Forge provides 9 slash commands, each designed for a specific QA workflow. All commands are invoked in Claude Code by typing `/qa:<command-name>`.

## Command Overview

### Planning & Analysis

| Command | Use When |
|---------|----------|
| [/qa:test-plan](test-plan.md) | You need a test strategy for a new feature, PR, or requirement |
| [/qa:test-cases](test-cases.md) | You need detailed test cases with positive, negative, edge, and boundary scenarios |
| [/qa:regression-plan](regression-plan.md) | You need to know what to retest after code changes |
| [/qa:coverage-gap](coverage-gap.md) | You want to find untested areas in your project |

### Code Generation

| Command | Use When |
|---------|----------|
| [/qa:api-scaffold](api-scaffold.md) | You need to create API test classes, executors, POJOs, and suite XML |
| [/qa:app-scaffold](app-scaffold.md) | You need to create mobile screen objects, test classes, and suite XML |
| [/qa:test-data](test-data.md) | You need test data in any format (JSON, DataProvider, DB fixtures, cache, CSV) |

### Investigation & Detection

| Command | Use When |
|---------|----------|
| [/qa:bug-investigate](bug-investigate.md) | You have a test failure, stack trace, or error to diagnose |
| [/qa:flaky-detect](flaky-detect.md) | You want to find and fix intermittent test failures |

## Common Usage Patterns

### New Feature Development
```
1. /qa:test-plan <feature description>     -- Plan your testing approach
2. /qa:test-cases <feature description>     -- Generate detailed test cases
3. /qa:api-scaffold <endpoint details>      -- Scaffold the automation code
4. /qa:test-data <schema reference>         -- Generate test data
```

### Release Preparation
```
1. /qa:regression-plan <PR link>            -- Identify what to retest
2. /qa:coverage-gap <service name>          -- Find gaps in coverage
3. /qa:flaky-detect <allure report URL>     -- Find unreliable tests before release
```

### Failure Investigation
```
1. /qa:bug-investigate <error message>      -- Root cause analysis
2. /qa:flaky-detect <test suite name>       -- Check if it's a known flaky pattern
```

## Input Formats

All commands accept `$ARGUMENTS` — free-text input after the command name. Examples:

```
/qa:test-plan user registration with email verification
/qa:api-scaffold POST /v1/orders with payload {productId, quantity, price}
/qa:bug-investigate java.lang.AssertionError: expected 200 but got 500
/qa:regression-plan https://github.com/org/repo/pull/42
/qa:coverage-gap orders service
/qa:flaky-detect checkout regression suite - last 20 runs
```

If you don't provide arguments, each command will ask you for the required inputs interactively.

## Output

All commands save their output to `doc/<category>/` in the current project directory:

| Command | Output Location |
|---------|----------------|
| test-plan | `doc/test-plans/<name>-<date>.md` |
| test-cases | `doc/test-cases/<name>-<date>.md` |
| api-scaffold | Actual code files in `src/` |
| app-scaffold | Actual code files in `src/` |
| bug-investigate | `doc/bug-reports/<name>-<date>.md` |
| regression-plan | `doc/regression-plans/<name>-<date>.md` |
| test-data | Varies (inline, `src/test/resources/`, `tests/fixtures/`) |
| flaky-detect | `doc/flaky-reports/<name>-<date>.md` |
| coverage-gap | `doc/coverage-reports/<name>-<date>.md` |
