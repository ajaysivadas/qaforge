---
name: qa:test-data
description: Generate test data for scenarios including API payloads, database fixtures, Redis state, Firestore documents, and CSV test data.
---

# QA Test Data Generator

Generate test data for various scenarios and data stores.

## Input

$ARGUMENTS

If no argument is provided, ask the user for:
- What data is needed (entity type, endpoint, or model)
- Schema or existing POJO/model class reference
- Scenarios to cover (positive, negative, edge, boundary)
- Target format (JSON, DataProvider, CSV, DB fixture, etc.)

## Knowledge Base

1. Read `~/.claude/qaforge-knowledge/INDEX.md` to determine which files to load
2. Detect the project framework, then read ONLY the matching framework file (for DataProvider/parametrize format)
3. Read `~/.claude/qaforge-knowledge/patterns/data-validation.md` only if data pipeline or cross-source validation is involved
4. Skip standards files — not needed for data generation
5. Read project `CLAUDE.md` if it exists

## Instructions

### Step 1: Understand Schema

Determine the schema from the best available source, in priority order:

1. **If a POJO/model class is referenced:** Read the file and extract all fields with types and constraints. Use `Grep("@NotNull\\|@Size\\|@Min\\|@Max\\|@Pattern\\|@Email\\|required", "<model-file>")` to find validation annotations.
2. **If a Swagger/OpenAPI spec is available:** Parse the request/response schemas from the spec.
3. **If an endpoint is referenced but no model file given:** Use `Grep("<endpoint-path>", "src/")` to find the controller/route, then trace to the request/response model.
4. **If described in words:** Infer the schema and present it to the user for confirmation before proceeding.

Document the schema:
| Field | Type | Required | Constraints | Example |
|-------|------|----------|-------------|---------|
| name | string | yes | 1-100 chars | "John Doe" |
| email | string | yes | valid email | "john@example.com" |
| age | integer | no | 0-150 | 30 |

### Step 2: Confirm Scope (Checkpoint)

Present the extracted schema to the user:
- Entity: <name>
- Fields: <count>
- Constraints found: <list>
- Estimated data sets: <count> (target 15-25 rows; cap at 40 for complex entities)

Ask: "Does this schema look correct? Any fields to add or constraints to adjust?"

### Step 3: Generate Data Sets

For each scenario dimension, generate appropriate data:

**Positive (happy path):**
- Valid data with all required fields
- Valid data with optional fields included
- Multiple valid combinations (different value ranges)
- Minimum valid payload (only required fields)

**Negative (error handling):**
- Missing each required field (one at a time)
- Wrong data types (string where integer expected, etc.)
- Null/empty values for required fields
- Invalid formats (malformed email, bad date format)

**Edge cases:**
- Empty strings, single-character strings
- Special characters: `<script>`, `'; DROP TABLE`, `\n\t\r`
- Unicode: emojis, CJK characters, RTL text
- Very long strings (at max length)
- Zero, negative numbers where positive expected
- Empty arrays/objects for collection fields

**Boundary values:**
- At minimum allowed value
- At minimum + 1
- At maximum allowed value
- At maximum - 1
- Just below minimum (invalid)
- Just above maximum (invalid)

### Step 4: Format for Target

Generate data in the format matching the project's framework:

**Java TestNG DataProvider:**
```java
@DataProvider(name = "createUserData")
public Object[][] createUserData() {
    return new Object[][] {
        // { scenario, payload, expectedStatusCode, expectedError }
        { "valid_full", validUserPayload(), 201, null },
        { "valid_minimal", minimalUserPayload(), 201, null },
        { "missing_name", payloadWithout("name"), 400, "name is required" },
        { "missing_email", payloadWithout("email"), 400, "email is required" },
        { "invalid_email", payloadWith("email", "not-an-email"), 400, "invalid email" },
        { "name_too_long", payloadWith("name", "x".repeat(101)), 400, "name too long" },
        { "negative_age", payloadWith("age", -1), 400, "age must be positive" },
        { "boundary_age_max", payloadWith("age", 150), 200, null },
        { "boundary_age_over", payloadWith("age", 151), 400, "age out of range" },
    };
}
```

**Python pytest parametrize:**
```python
@pytest.mark.parametrize("scenario,payload,expected_status,expected_error", [
    ("valid_full", {"name": "John", "email": "john@example.com", "age": 30}, 201, None),
    ("valid_minimal", {"name": "Jane", "email": "jane@example.com"}, 201, None),
    ("missing_name", {"email": "test@example.com"}, 400, "name is required"),
    ("invalid_email", {"name": "John", "email": "not-an-email"}, 400, "invalid email"),
    ("xss_attempt", {"name": "<script>alert(1)</script>", "email": "a@b.com"}, 400, None),
    ("sql_injection", {"name": "'; DROP TABLE users;--", "email": "a@b.com"}, 400, None),
])
def test_create_user(scenario, payload, expected_status, expected_error):
    ...
```

**Jest/Playwright test.each:**
```javascript
test.each([
  { scenario: 'valid', payload: { name: 'John', email: 'john@test.com' }, status: 201 },
  { scenario: 'missing_name', payload: { email: 'john@test.com' }, status: 400 },
  { scenario: 'invalid_email', payload: { name: 'John', email: 'bad' }, status: 400 },
])('create user - $scenario', async ({ payload, status }) => {
  const res = await request.post('/api/users', { data: payload });
  expect(res.status()).toBe(status);
});
```

**JSON fixture files:**
```json
{
  "valid_users": [
    { "name": "John Doe", "email": "john@example.com", "age": 30 },
    { "name": "Jane Smith", "email": "jane@example.com", "age": 25 }
  ],
  "invalid_users": [
    { "name": "", "email": "john@example.com", "_expect": "name required" },
    { "name": "John", "email": "not-email", "_expect": "invalid email" }
  ]
}
```

**CSV test data:**
```csv
scenario,name,email,age,expected_status,expected_error
valid_full,John Doe,john@example.com,30,201,
valid_minimal,Jane,jane@example.com,,201,
missing_name,,test@example.com,25,400,name is required
invalid_email,John,not-email,30,400,invalid email
```

**Database seed scripts (SQL):**
```sql
-- Test fixtures: clean insert
DELETE FROM users WHERE email LIKE '%@test.example.com';
INSERT INTO users (name, email, age, created_at) VALUES
  ('Test User 1', 'user1@test.example.com', 30, NOW()),
  ('Test User 2', 'user2@test.example.com', 25, NOW());
```

### Step 5: Generate Setup/Teardown

Provide code to load and clean up the test data using the project's existing patterns:
- Database: transactions with rollback, or explicit DELETE in teardown
- Cache (Redis): use a test-specific key prefix, flush in teardown
- Document stores (Firestore, MongoDB): use test collection or unique doc IDs
- File stores: write to temp directory, clean up after

### Step 6: Security Considerations

**NEVER include in generated test data:**
- Real passwords, API keys, or secrets — use placeholders like `test-password-123`
- Real PII (names, emails, phone numbers) — use obviously fake data like `test@example.com`
- Production database connection strings
- Real credit card numbers — use test numbers (e.g., `4111111111111111`)

**DO include security test data:**
- XSS payloads: `<script>alert(1)</script>`, `<img onerror=alert(1)>`
- SQL injection: `' OR 1=1 --`, `'; DROP TABLE users;--`
- Path traversal: `../../etc/passwd`
- Oversized payloads: strings at 10x max length
- Special encoding: null bytes, unicode exploits

### Step 7: Present and Save

Present the generated data with a summary table:

| Scenario Type | Count | Format |
|--------------|-------|--------|
| Positive | X | DataProvider/parametrize |
| Negative | X | DataProvider/parametrize |
| Edge | X | DataProvider/parametrize |
| Boundary | X | DataProvider/parametrize |

Ask the user where to save. Suggested locations:
- Java: `src/test/resources/testdata/<entity>.json` or inline DataProvider
- Python: `tests/fixtures/<entity>.json` or inline parametrize
- JS/TS: `tests/fixtures/<entity>.json` or inline test.each
- CSV: `testdata/<entity>.csv`

Write files and report what was generated.
