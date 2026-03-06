---
name: qa:api-scaffold
description: Generate API test scaffolding from endpoints, Swagger specs, or service descriptions. Creates test classes, API executors, payloads, and TestNG suite XML.
---

# QA API Test Scaffolding

Generate complete API test automation code from endpoint specifications.

## Input

$ARGUMENTS

If no argument is provided, ask the user for:
- API endpoint(s) or Swagger/OpenAPI spec URL
- Service name
- HTTP method(s) and expected behavior

## Knowledge Base

1. Read `~/.claude/qaforge-knowledge/INDEX.md` to determine which files to load
2. Detect the project framework (Step 2 below), then read ONLY the matching framework file from the index
3. Read `~/.claude/qaforge-knowledge/standards/test-naming.md` and `standards/test-structure.md`
4. If the endpoint is GraphQL, also read the graphql-testing pattern. Otherwise skip pattern files.
5. Read project `CLAUDE.md` if it exists

## Instructions

### Step 1: Gather API Information

If a Swagger/OpenAPI URL is provided, fetch and parse the spec.
Otherwise collect: base URI, endpoint path(s), HTTP method(s), request payload, response structure, auth type, query parameters.

### Step 2: Read Existing Framework Code

Scan the current project to understand existing patterns using concrete searches:

**For Java/TestNG projects:**
1. `Grep("enum.*URI\\|BASE_URI\\|baseUri", "src/")` — find base URI enum or config
2. `Grep("enum.*Endpoint\\|endpoint", "src/")` or `Glob("**/endpoints/*.java")` — find endpoint constants
3. `Glob("**/executor/*Executor.java")` or `Glob("**/api/*Api.java")` — find existing API executor classes
4. `Glob("src/test/**/*Test.java")` — find existing test classes for style reference
5. `Glob("**/test-suite/**/*.xml")` — find TestNG suite XMLs

**For Python projects:**
1. `Glob("**/managers/*.py")` or `Glob("**/api/*.py")` — find API wrapper patterns
2. `Read("tests/conftest.py")` — read existing fixtures
3. `Glob("tests/**/*test*.py")` — find existing test files for style

**For JS/TS projects:**
1. `Glob("**/*.{test,spec}.{ts,js}")` — find existing tests
2. `Glob("**/fixtures/**")` — find test fixtures and helpers
3. Read `package.json` to identify test framework (Jest, Playwright, Cypress)

Read at least one existing test file and one executor/helper to match the exact code style. If no existing patterns are found, use the knowledge base patterns as the template.

### Step 3: Generate Code

Follow the **exact patterns** from the framework knowledge file. Do not improvise structure — replicate what exists.

**For Java/TestNG, generate in this order:**

1. **Endpoint additions** (if new endpoint)
2. **Base URI additions** (if new service)
3. **Request POJO** — request body object
4. **Response POJO** — response deserialization object
5. **API Executor** — static synchronized API call methods
6. **Test Class** — with @BeforeClass API call, @Test assertions
7. **TestNG Suite XML** — suite definition
8. **Maven Profile** — run configuration in pom.xml

Key rules from knowledge base:
- API calls in @BeforeClass, assertions in @Test
- Static response fields
- Private callback methods for Allure wrapping
- One assertion per test method
- Use custom Assertions class (not raw TestNG)
- Use AllureManager.executeStep for step logging

### Step 4: Generate Negative/Edge Case Test Classes

For each endpoint, also generate:
- Invalid authentication tests — 401/403
- Missing required field tests — 400 for each required field
- Resource not found tests — 404

### Step 5: Present and Confirm

List all files to be created/modified with a summary:
| # | File Path | Type | Action |
|---|-----------|------|--------|
| 1 | <path> | Executor / Test / POJO / Suite XML | Create / Modify |

Ask user for confirmation before writing files.

After confirmation, create all files. Report what was generated with line counts per file.
