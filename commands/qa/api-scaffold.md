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

**MUST READ** before generating code:
- `~/.claude/qa-pilot-knowledge/frameworks/testng-restassured.md` — exact class structure, executor pattern, assertion pattern
- `~/.claude/qa-pilot-knowledge/frameworks/pytest.md` — if Python project detected
- `~/.claude/qa-pilot-knowledge/standards/test-naming.md` — naming conventions
- `~/.claude/qa-pilot-knowledge/standards/test-structure.md` — file organization

Also read project CLAUDE.md if it exists — it has project-specific patterns.

## Instructions

### Step 1: Gather API Information

If a Swagger/OpenAPI URL is provided, fetch and parse the spec.
Otherwise collect: base URI, endpoint path(s), HTTP method(s), request payload, response structure, auth type, query parameters.

### Step 2: Read Existing Framework Code

For Java/TestNG projects, read these files to match existing patterns exactly:
1. `src/main/java/MarketFeed/Api_Test/Base/URI/BaseUri.java` — existing service URIs
2. `src/main/java/MarketFeed/Api_Test/Base/URI/EndPoint.java` — existing endpoints
3. One existing `ApiExecutors/<Service>/` file — match the exact style
4. One existing test class — match the exact annotation and structure style
5. `test-suite/` — match XML format

For Python projects, read:
1. `src/managers/` — existing manager patterns
2. `tests/conftest.py` — existing fixtures
3. One existing test file — match style

### Step 3: Generate Code

Follow the **exact patterns** from the framework knowledge file. Do not improvise structure — replicate what exists.

**For Java/TestNG, generate in this order:**

1. **EndPoint additions** (if new endpoint)
2. **BaseUri additions** (if new service)
3. **Request POJO** in `src/main/java/MarketFeed/Api_Test/RequestPojo/<Service>/`
4. **Response POJO** in `src/main/java/MarketFeed/Api_Test/ResponsePojo/<Service>/`
5. **API Executor** in `src/main/java/MarketFeed/Api_Test/ApiExecutors/<Service>/`
6. **Test Class** in `src/test/java/MarketFeed/Api_Test/<Service>/<Feature>/`
7. **TestNG Suite XML** in `test-suite/<Service>/`
8. **Maven Profile** addition to `pom.xml`

Key rules from knowledge base:
- API calls in @BeforeClass, assertions in @Test
- Static response fields
- Private callback methods for Allure wrapping
- One assertion per test method
- Use Assertions class (not raw TestNG)
- Use AllureManager.executeStep for step logging

### Step 4: Generate Negative/Edge Case Test Classes

For each endpoint, also generate:
- `InvalidAuth<Feature>` — 401/403 tests
- `MissingFields<Feature>` — 400 tests for each required field
- `NotFound<Feature>` — 404 test

### Step 5: Present and Confirm

List all files to be created/modified with a summary. Ask user for confirmation before writing files.

After confirmation, create all files. Report what was generated.
