# Test Coverage Criteria

## Coverage Levels

### Level 1: Smoke (Minimum Viable)
Every endpoint/screen must have at minimum:
- Happy path with valid data -> 200/201
- Authentication check -> 401 without token
- Core assertion on response body

### Level 2: Functional (Standard)
Everything in Level 1, plus:
- All required fields validated (missing each -> 400)
- Key business logic assertions
- Not-found case -> 404
- All response fields type-checked

### Level 3: Comprehensive (Full)
Everything in Level 2, plus:
- All input combinations (equivalence partitioning)
- Boundary values for numeric/string fields
- Special characters and unicode
- Concurrent access scenarios
- Performance baseline assertions
- Error response body validation
- Integration with dependent services

## Per-Endpoint Coverage Checklist

### GET Endpoint
- [ ] Valid request returns 200
- [ ] Response schema matches contract
- [ ] All query parameters work
- [ ] Pagination works (first, middle, last page)
- [ ] Empty result set returns 200 with empty array
- [ ] Invalid ID returns 404
- [ ] No auth returns 401
- [ ] Response time < threshold

### POST Endpoint
- [ ] Valid creation returns 201
- [ ] Created resource matches input
- [ ] Missing required fields return 400 (test each field)
- [ ] Invalid data types return 400
- [ ] Duplicate creation handled (409 or idempotent)
- [ ] Empty body returns 400
- [ ] No auth returns 401
- [ ] Response includes created resource ID

### PUT/PATCH Endpoint
- [ ] Valid update returns 200
- [ ] Updated fields persist
- [ ] Partial update works (PATCH)
- [ ] Non-existent resource returns 404
- [ ] Invalid data returns 400
- [ ] Concurrent update handled
- [ ] No auth returns 401

### DELETE Endpoint
- [ ] Valid delete returns 200/204
- [ ] Deleted resource not retrievable (404)
- [ ] Non-existent resource returns 404
- [ ] No auth returns 401
- [ ] Cascading deletes work (if applicable)

## Per-Screen Coverage Checklist (Mobile)

- [ ] Screen loads and displays correctly
- [ ] All interactive elements respond
- [ ] Form validation works (empty, invalid, valid)
- [ ] Navigation to/from screen works
- [ ] Back button behavior correct
- [ ] Loading state visible during async ops
- [ ] Error state displays on failure
- [ ] Empty state for no data
- [ ] Screen rotation doesn't break layout
- [ ] Keyboard doesn't cover input fields

## Data Pipeline Coverage

- [ ] Complete data arrives (no missing records)
- [ ] Data values accurate (within tolerance)
- [ ] Data arrives timely (within SLA)
- [ ] Cross-source consistency
- [ ] No duplicate records
- [ ] Schema matches expected structure
- [ ] Edge cases: holidays, off-hours, boundary dates

## Coverage Metrics Targets

| Metric | Smoke | Standard | Comprehensive |
|--------|-------|----------|---------------|
| Endpoints covered | 100% | 100% | 100% |
| Test cases per endpoint | 1-3 | 5-10 | 15-25 |
| Positive/Negative ratio | 100/0 | 60/40 | 40/40/20 (edge) |
| Execution time target | < 5 min | < 20 min | < 45 min |
| Flaky tolerance | 0% | < 5% | < 2% |

## Priority Assignment

| Priority | Definition | Required for |
|----------|-----------|-------------|
| P0 | Blocks release if failing | Every merge |
| P1 | Important but not blocking | Every deployment |
| P2 | Good to have | Nightly/weekly |
| P3 | Nice to have | On-demand |
