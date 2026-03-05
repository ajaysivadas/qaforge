# Test Structure Standards

## Principle: Arrange-Act-Assert (AAA)

Every test follows:
1. **Arrange**: Set up test data and preconditions (fixtures, @BeforeClass)
2. **Act**: Execute the action under test (API call, UI interaction)
3. **Assert**: Verify the expected outcome (one assertion per test method)

## Java TestNG Structure

### Single API Test Class
```
TestClass
├── @BeforeClass: Call API, store response
├── @Test: verify_Status_Code
├── @Test: verify_Response_Field_1
├── @Test: verify_Response_Field_2
├── @Test: verify_Response_Field_N
└── @AfterClass: Clean up test data
```

### Integration Flow Test Class
```
TestClass
├── @BeforeClass: Set up preconditions
├── @Test(priority=1): Step 1 — Call Service A
├── @Test(priority=2): Step 2 — Verify propagation to Service B
├── @Test(priority=3): Step 3 — Verify end state
└── @AfterClass: Clean up across services
```

### Test Suite Organization
```
test-suite/
├── ServiceA/
│   ├── testng-smoke.xml          # Quick validation (5-10 tests)
│   ├── testng-regression.xml     # Full coverage (50+ tests)
│   └── testng-feature.xml        # Feature-specific
├── ServiceB/
└── Integration/
    └── testng-e2e.xml            # Cross-service flows
```

## Python pytest Structure

### Single Feature Module
```
tests/feature/
├── conftest.py          # Feature-specific fixtures
├── test_happy_path.py   # Positive scenarios
├── test_edge_cases.py   # Edge and boundary
└── test_error_cases.py  # Negative scenarios
```

### Data Pipeline Test Module
```
tests/backtest/
├── conftest.py               # Data setup fixtures
├── test_trades_comparison.py  # Compare actual vs expected trades
└── test_pnl_calculation.py    # Verify P&L computations
```

## Test Independence Rules

1. **No inter-class dependencies**: Each test class runs in isolation
2. **No inter-method dependencies** (except with explicit `dependsOnMethods` or `priority`)
3. **Own setup/teardown**: Each class manages its own lifecycle
4. **Unique test data**: Use unique IDs, timestamps, or UUIDs
5. **No shared mutable state**: ThreadLocal for parallel execution

## Test Data Strategy

### Static Test Data (committed to repo)
- JSON fixtures for request/response templates
- CSV files for backtest expected results
- Configuration constants in TestData classes

### Dynamic Test Data (generated at runtime)
- Unique IDs with timestamps
- Data fetched from test-specific Firestore collections
- Redis state populated in fixtures

### Production Data References (read-only)
- Option chain data from Redis
- Market data from BigQuery
- Config from Firestore (read, never write)

## Test Categorization

### Smoke Tests
- 5-10 critical path tests
- Run in < 5 minutes
- Verify service is alive and core flow works
- Run on every deployment

### Regression Tests
- Full feature coverage
- Run in < 30 minutes
- Cover positive, negative, edge cases
- Run nightly or pre-release

### Integration Tests
- Cross-service flows
- May take longer (external dependencies)
- Run on demand or weekly

### Observability Tests
- Data quality validation
- Compare data sources
- Run on schedule (daily/weekly)

## File Organization

### Java Projects
```
src/
├── main/java/MarketFeed/Api_Test/
│   ├── ApiExecutors/<Service>/     # One executor class per service
│   ├── Assertions/                 # Shared assertion utilities
│   ├── Base/                       # Framework foundation
│   ├── RequestPojo/<Service>/      # Request body objects
│   ├── ResponsePojo/<Service>/     # Response objects
│   ├── Payloads/                   # Payload builders
│   ├── Reports/Listeners/          # One listener per service
│   └── Utils/                      # Shared utilities
├── test/java/MarketFeed/Api_Test/
│   └── <Service>/<Feature>/        # Test classes
└── test/resources/
    └── testdata/<feature>/         # JSON/CSV fixtures
```

### Python Projects
```
src/
├── components/      # GCP service clients (singletons)
├── managers/        # Business logic wrappers
└── utils/           # Shared utilities

tests/
├── conftest.py      # Global fixtures
├── <feature>/
│   ├── conftest.py  # Feature fixtures
│   └── test_*.py    # Test modules
└── fixtures/        # Shared test data files
```
