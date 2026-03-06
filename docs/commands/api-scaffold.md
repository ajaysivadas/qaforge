# /qa:api-scaffold

Generate complete API test automation code from endpoint specifications.

## Usage

```
/qa:api-scaffold <endpoint details, Swagger URL, or service description>
```

## Examples

```
/qa:api-scaffold POST /v1/orders with productId and quantity payload
/qa:api-scaffold GET /v1/users/{userId} for user service
/qa:api-scaffold CRUD endpoints for product catalog
/qa:api-scaffold https://api.example.com/swagger.json
```

## What It Generates

### For Java/TestNG:

| File | Purpose |
|------|---------|
| Endpoint constant | New endpoint in enum/config |
| Base URI addition | New service URI (if needed) |
| Request POJO | Request body object |
| Response POJO | Response deserialization object |
| API Executor | Static synchronized API call methods |
| Test Class (positive) | Happy path tests |
| Test Class (negative) | Error case tests (401, 400, 404) |
| TestNG Suite XML | Suite definition |
| Maven Profile | Run configuration |

### For Python/pytest:

| File | Purpose |
|------|---------|
| Manager class | API wrapper using existing patterns |
| Test module | Test functions with fixtures |
| Conftest | Feature-specific fixtures |

## How It Works

1. Reads your existing code to match patterns exactly
2. Follows the knowledge base rules for structure and conventions
3. Asks for confirmation before writing any files

## Tips

- Run from inside the project directory so it can read existing code
- Provide request/response JSON examples for accurate POJO generation
- Specify the service name to match existing package organization
