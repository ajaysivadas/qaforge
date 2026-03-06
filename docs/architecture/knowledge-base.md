# Knowledge Base Architecture

The knowledge base is the "training" layer of QA Forge. It contains curated QA expertise that commands reference at execution time to produce framework-specific, pattern-consistent output.

## Structure

```
knowledge/
  frameworks/              # HOW to write code in each framework
    testng-restassured.md  # Java API test patterns
    appium-selenide.md     # Java mobile test patterns
    pytest.md              # Python test patterns
    playwright.md          # TypeScript/JS browser test patterns
  patterns/                # WHAT to test and common issues
    api-testing.md         # API test design matrix
    mobile-testing.md      # Mobile test verification checklist
    data-validation.md     # Data pipeline validation patterns
    flaky-test-patterns.md # 10 flaky test patterns with fixes
  standards/               # HOW to name and organize tests
    test-naming.md         # Naming conventions per framework
    test-structure.md      # File organization and test independence
    coverage-criteria.md   # Per-endpoint/screen coverage checklists
```

## Framework Knowledge Files

Each framework file contains:

1. **Exact class structure** — complete code examples of test classes, page objects, executors
2. **Key rules** — numbered list of non-negotiable patterns
3. **Package structure** — where each file type belongs
4. **Common patterns** — authentication, data providers, fixtures, reporting
5. **Anti-patterns** — what NOT to do

## Pattern Knowledge Files

Each pattern file contains:

1. **What to test** — comprehensive checklists and matrices
2. **How to test it** — code examples for each scenario
3. **What not to do** — anti-patterns and common mistakes
4. **Framework-agnostic guidance** — applies to any implementation

### api-testing.md highlights:
- Request validation matrix (15 status code scenarios)
- Response body verification checklist (10 dimensions)
- Data integrity test patterns (CRUD lifecycle)
- Integration test patterns (cross-service)

### flaky-test-patterns.md highlights:
10 patterns, each with symptom, root cause, detection heuristics, and code-level fixes

## How Commands Reference Knowledge

Each command has a `## Knowledge Base` section:

```markdown
## Knowledge Base

**MUST READ** before generating code:
- `~/.claude/qaforge-knowledge/frameworks/testng-restassured.md`
- `~/.claude/qaforge-knowledge/standards/test-naming.md`
```

The `MUST READ` directive tells Claude to read these files before generating output.

## Extending the Knowledge Base

### Add a new framework

1. Create `knowledge/frameworks/<framework-name>.md`
2. Include: class structure, key rules, package structure, common patterns
3. Update relevant commands to reference the new file
4. Reinstall: `npx qaforge --global`

### Add new patterns

1. Create `knowledge/patterns/<pattern-name>.md`
2. Include: what, how, anti-patterns, code examples
3. Reference from relevant commands
4. Reinstall

See [Contributing Guide](../../CONTRIBUTING.md) for details.
