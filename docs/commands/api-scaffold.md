# /qa:api-scaffold

Generate complete API test automation code from endpoint specifications.

## Usage

```
/qa:api-scaffold <endpoint details, Swagger URL, or service description>
```

## Examples

```
/qa:api-scaffold POST /v1/trade-ideas with strategyType and strikes payload
/qa:api-scaffold GET /v1/orders/{orderId} for TAP service
/qa:api-scaffold CRUD endpoints for Account Service
/qa:api-scaffold https://api.example.com/swagger.json
```

## What It Generates

### For Java/TestNG (API-Automation):

| File | Location | Purpose |
|------|----------|---------|
| EndPoint addition | `Base/URI/EndPoint.java` | New endpoint constant |
| BaseUri addition | `Base/URI/BaseUri.java` | New service URI (if needed) |
| Request POJO | `RequestPojo/<Service>/` | Request body object |
| Response POJO | `ResponsePojo/<Service>/` | Response deserialization object |
| API Executor | `ApiExecutors/<Service>/` | Static synchronized API call methods |
| Test Class (positive) | `src/test/java/.../<Feature>/` | Happy path test |
| Test Class (negative) | `src/test/java/.../<Feature>/` | Error case tests (401, 400, 404) |
| TestNG Suite XML | `test-suite/<Service>/` | Suite definition |
| Maven Profile | `pom.xml` | Run configuration |

### For Python/pytest (Quant-Research):

| File | Location | Purpose |
|------|----------|---------|
| Manager class | `src/managers/` | API wrapper using existing patterns |
| Test module | `tests/<feature>/` | Test functions with fixtures |
| Conftest | `tests/<feature>/conftest.py` | Feature-specific fixtures |

## How It Works

1. Reads your existing code to match patterns exactly:
   - Existing API executors (style, return types, method signatures)
   - Existing test classes (annotation patterns, assertion usage)
   - Existing POJOs (field naming, serialization annotations)
2. Follows the knowledge base rules:
   - API calls in `@BeforeClass`, assertions in `@Test`
   - One assertion per test method
   - Static response fields shared across methods
   - Private callback methods for Allure step wrapping
   - `Assertions` class (not raw TestNG assertions)
3. Asks for confirmation before writing any files

## Tips

- Run from inside the project directory so it can read existing code
- Provide request/response JSON examples for accurate POJO generation
- Specify the service name to match existing package organization
