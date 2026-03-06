# Getting Started with QA Forge

This guide walks you through installing QA Forge and running your first commands.

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or later
- [Claude Code](https://claude.com/claude-code) installed and authenticated
- A QA automation project (Java/TestNG, Python/pytest, or Node.js/Playwright)

## Step 1: Install QA Forge

```bash
npx qaforge
```

This installs:
- 9 slash commands to `~/.claude/commands/qa/`
- 11 knowledge files to `~/.claude/qaforge-knowledge/`

## Step 2: Scan Your Project

Navigate to your test automation project and scan it:

```bash
cd ~/your-project
npx qaforge --scan
```

This generates `.claude/qaforge-context.md` — a summary of your project's framework, test inventory, and CI setup. Commands use this for context-aware output.

## Step 3: Run Your First Command

Open Claude Code in your project directory and try:

```
/qa:test-plan user login with email and OAuth
/qa:test-cases order placement with discount codes
/qa:api-scaffold POST /v1/users with name and email
/qa:bug-investigate TimeoutException in checkout test
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
/qa:flaky-detect <report URL>    # 3. Find flaky tests
```

### Debugging
```
/qa:bug-investigate <error>      # Quick root cause analysis
```

## Troubleshooting

### Commands not showing up?

Re-install and restart Claude Code:
```bash
npx qaforge --global
```

### Output doesn't match your project patterns?

1. Add a `CLAUDE.md` to your project root with framework guidance
2. Run `npx qaforge --scan` to generate project context
3. Both files help commands understand your specific patterns

## Next Steps

- Read the [Command Reference](../commands/README.md) for detailed usage
- Read the [Architecture Overview](../architecture/README.md) to understand how it works
- Check [Contributing](../../CONTRIBUTING.md) to add new commands or extend the knowledge base
