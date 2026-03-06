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

Scan the current project to understand existing patterns:

For Java/TestNG projects, look for:
1. Base URI enum or config — existing service URIs
2. Endpoint enum or constants — existing endpoint paths
3. Existing API executor classes — match the exact style
4. Existing test classes — match the exact annotation and structure style
5. TestNG suite XMLs — match XML format

For Python projects, look for:
1. Existing manager classes — match API wrapper patterns
2. `conftest.py` — existing fixtures
3. Existing test files — match style

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

List all files to be created/modified with a summary. Ask user for confirmation before writing files.

After confirmation, create all files. Report what was generated.
