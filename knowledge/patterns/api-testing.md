# API Testing Patterns

## Request Validation Matrix

For every API endpoint, test these dimensions:

### Status Code Tests
| Scenario | Expected Code | Priority |
|----------|--------------|----------|
| Valid request with all fields | 200/201 | P0 |
| Valid request with minimal fields | 200/201 | P1 |
| Missing required field (each one) | 400 | P0 |
| Invalid data type | 400 | P1 |
| Empty request body | 400 | P1 |
| Invalid auth token | 401 | P0 |
| Expired auth token | 401 | P1 |
| No auth token | 401 | P0 |
| Forbidden resource | 403 | P1 |
| Non-existent resource | 404 | P0 |
| Duplicate creation | 409 | P1 |
| Invalid content type | 415 | P2 |
| Rate limit exceeded | 429 | P2 |
| Server error simulation | 500 | P2 |

### Response Body Tests
| What to Verify | Why | Priority |
|---------------|-----|----------|
| All expected fields present | Schema compliance | P0 |
| Field data types correct | Contract validation | P0 |
| Null fields handled | Null safety | P1 |
| Array fields (empty, one, many) | Collection handling | P1 |
| Nested object structure | Deep schema validation | P1 |
| Date/time formats | Consistency | P2 |
| Enum values within range | Data integrity | P1 |
| Pagination metadata | Navigation | P1 |
| Error response structure | Error handling | P0 |

### Data Integrity Tests
| Scenario | What to Check |
|----------|--------------|
| Create -> Read | Created data matches input |
| Create -> Update -> Read | Updated data persists |
| Create -> Delete -> Read | Deleted data returns 404 |
| Concurrent creates | No duplicates, no race conditions |
| Large payload | Handles within limits |
| Special characters | Unicode, HTML entities, SQL-like strings |
| Boundary values | Min/max for numbers, empty/max-length strings |

## REST API Test Design Rules

1. **One assertion per test method** — makes failures precise and Allure reports clear
2. **API call in setup, assertions in tests** — separation of concerns
3. **Static response variables** — shared across test methods in same class
4. **Test independence** — each test class can run standalone
5. **Idempotent tests** — running twice produces same result
6. **Clean up after yourself** — delete test data in @AfterClass

## Common Anti-Patterns to Avoid

- Testing multiple endpoints in one test class (unless it's an integration flow)
- Hardcoding environment-specific URLs in tests
- Depending on data created by other test classes
- Asserting on timestamps without tolerance
- Ignoring response headers (especially pagination, rate limit headers)
- Not testing error response body structure

## Integration Test Patterns

For cross-service tests:
```
1. Create resource in Service A
2. Verify propagation to Service B (with polling/wait)
3. Verify state consistency across services
4. Clean up in reverse order (Service B, then Service A)
```

## Performance Smoke Tests

Every API test class can include:
- Response time assertion (< threshold)
- Payload size check (within limits)
- No N+1 query indicators (response time doesn't grow with data)
