# Knowledge Base Architecture

The knowledge base is the "training" layer of QA Pilot. It contains curated QA expertise that commands reference at execution time to produce framework-specific, pattern-consistent output.

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
2. **Key rules** — numbered list of non-negotiable patterns (e.g., "API calls in @BeforeClass, assertions in @Test")
3. **Package structure** — where each file type belongs
4. **Common patterns** — authentication, data providers, fixtures, reporting
5. **Anti-patterns** — what NOT to do

### Example: testng-restassured.md

Covers:
- Test class template with annotations
- API executor pattern (static synchronized methods)
- HTTP request chain (inheritance hierarchy)
- EndPoint enum with ThreadLocal path params
- Custom Assertions class (not raw TestNG)
- TestNG suite XML format
- Maven profile format
- Pre-requisite validation flow
- Severity level mapping

This means when `/qa:api-scaffold` generates code, it produces output identical to hand-written code in the project.

## Pattern Knowledge Files

Each pattern file contains:

1. **What to test** — comprehensive checklists and matrices
2. **How to test it** — code examples for each scenario
3. **What not to do** — anti-patterns and common mistakes
4. **Framework-agnostic guidance** — applies to any implementation

### Example: api-testing.md

Contains:
- Request validation matrix (15 status code scenarios)
- Response body verification checklist (10 dimensions)
- Data integrity test patterns (CRUD lifecycle)
- Integration test patterns (cross-service)
- Performance smoke test guidance
- Common anti-patterns to avoid

### Example: flaky-test-patterns.md

Contains 10 patterns, each with:
- Symptom description
- Root cause explanation
- Detection heuristics
- Code-level fix (both bad and good examples)
- Framework-specific fixes (Java, Python, mobile)

## Standard Knowledge Files

### test-naming.md
- Java TestNG: `verify_Expected_Behavior` pattern
- Python pytest: `test_what_condition` pattern
- Class, method, file naming for each framework
- Allure annotation conventions (Epic, Feature, Story, Severity)
- Branch naming rules

### test-structure.md
- Arrange-Act-Assert principle
- Test class anatomy (setup -> tests -> teardown)
- Test suite organization (smoke, regression, integration)
- Test independence rules
- Test data strategy (static, dynamic, production references)

### coverage-criteria.md
- Three coverage levels (Smoke, Functional, Comprehensive)
- Per-endpoint checklists (GET: 8 points, POST: 8, PUT: 7, DELETE: 5)
- Per-screen checklist (10 points)
- Data pipeline checklist (7 points)
- Coverage metrics targets
- Priority assignment guide

## How Commands Reference Knowledge

Each command has a `## Knowledge Base` section with explicit references:

```markdown
## Knowledge Base

**MUST READ** before generating code:
- `~/.claude/qa-pilot-knowledge/frameworks/testng-restassured.md`
- `~/.claude/qa-pilot-knowledge/standards/test-naming.md`
```

The `MUST READ` directive tells Claude to read these files before generating output. This ensures:
- Generated code matches project patterns
- Test design follows established best practices
- Naming and structure are consistent

## Extending the Knowledge Base

To add support for a new framework:

1. Create `knowledge/frameworks/<framework-name>.md`
2. Include: class structure, key rules, package structure, common patterns
3. Update relevant commands to reference the new file
4. Reinstall: `npx qa-pilot --global`

To add new patterns:

1. Create `knowledge/patterns/<pattern-name>.md`
2. Include: what, how, anti-patterns, code examples
3. Reference from relevant commands
4. Reinstall

See [Contributing Guide](../../CONTRIBUTING.md) for details.
