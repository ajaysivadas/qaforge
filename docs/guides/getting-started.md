# Getting Started with QA Pilot

This guide walks you through installing QA Pilot and running your first commands.

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or later
- [Claude Code](https://claude.com/claude-code) installed and authenticated
- A QA automation project (Java/TestNG, Python/pytest, or Node.js/Playwright)

## Step 1: Install QA Pilot

```bash
npx qa-pilot
```

This installs:
- 9 slash commands to `~/.claude/commands/qa/`
- 11 knowledge files to `~/.claude/qa-pilot-knowledge/`

You'll see:
```
  ╔═══════════════════════════════════════╗
  ║           QA PILOT v1.0.0            ║
  ║   QA Workflow System for Claude Code  ║
  ╚═══════════════════════════════════════╝

  [OK] Installed 9 commands to ~/.claude/commands/qa/
  [OK] Installed 11 knowledge files to ~/.claude/qa-pilot-knowledge/
```

## Step 2: Scan Your Project

Navigate to your test automation project and scan it:

```bash
cd ~/your-project
npx qa-pilot --scan
```

This generates `.claude/qa-pilot-context.md` — a summary of your project's framework, test inventory, and CI setup. Commands use this for context-aware output.

Example output for a Java/Maven project:
```
# QA Pilot - Project Context
## Framework: Java/Maven
- Test Runner: TestNG
- HTTP Client: RestAssured
- Reporting: Allure

### Maven Profiles (28)
- Tis-Stage
- Tap-Stage-Regression
- ...

## Test Inventory
- Java test files: 1157

## Existing CLAUDE.md: Yes
## CI/CD: .github/workflows
```

## Step 3: Run Your First Command

Open Claude Code in your project directory and try:

### Generate a test plan
```
/qa:test-plan order placement flow for TAP service
```

### Generate test cases
```
/qa:test-cases trade idea creation with iron condor strategy
```

### Scaffold API tests
```
/qa:api-scaffold POST /v1/trade-ideas with strategyType and strikes
```

### Investigate a failure
```
/qa:bug-investigate NoHttpResponseException in TAP regression suite
```

## Step 4: Review Output

Most commands save their output to `doc/` in your project:

```
doc/
  test-plans/          # From /qa:test-plan
  test-cases/          # From /qa:test-cases
  bug-reports/         # From /qa:bug-investigate
  regression-plans/    # From /qa:regression-plan
  flaky-reports/       # From /qa:flaky-detect
  coverage-reports/    # From /qa:coverage-gap
```

Scaffold commands (`/qa:api-scaffold`, `/qa:app-scaffold`) generate actual source code files in your `src/` directory.

## Common Workflows

### New Feature Testing
```
/qa:test-plan <feature>          # 1. Plan your approach
/qa:test-cases <feature>         # 2. Generate test cases
/qa:api-scaffold <endpoints>     # 3. Scaffold the code
/qa:test-data <schema>           # 4. Generate test data
```

### Release Preparation
```
/qa:regression-plan <PR link>    # 1. What to retest
/qa:coverage-gap <service>       # 2. Find gaps
/qa:flaky-detect <allure URL>    # 3. Find flaky tests
```

### Debugging
```
/qa:bug-investigate <error>      # Quick root cause analysis
```

## Troubleshooting

### Commands not showing up in Claude Code?

Re-install:
```bash
npx qa-pilot --global
```

Then restart Claude Code.

### Output doesn't match your project patterns?

1. Make sure you have a `CLAUDE.md` in your project root with framework guidance
2. Run `npx qa-pilot --scan` to generate project context
3. Both files help commands understand your specific patterns

### Command execution seems slow or generic?

The commands rely on Claude reading knowledge files. If a command says `MUST READ`, it will read those files before generating output. This takes a moment but produces much better results.

## Next Steps

- Read the [Command Reference](../commands/README.md) for detailed usage of each command
- Read the [Architecture Overview](../architecture/README.md) to understand how it works
- Check [Contributing](../../CONTRIBUTING.md) to add new commands or extend the knowledge base
