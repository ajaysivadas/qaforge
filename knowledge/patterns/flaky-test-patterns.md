# Flaky Test Patterns & Fixes

## Pattern 1: Timing / Race Condition

**Symptom**: Test passes locally, fails intermittently on CI. Failures involve "element not found", "expected X but got null", or stale data.

**Root Cause**: Test reads data before async operation completes.

**Fix**:
```java
// BAD: Fixed sleep
Thread.sleep(5000);
apiCall();
assertResult();

// GOOD: Poll with timeout
int retries = 10;
while (retries-- > 0) {
    result = fetchResult();
    if (result != null && result.getStatus().equals("COMPLETED")) break;
    Thread.sleep(1000);
}
assertNotNull(result, "Result not available after 10 seconds");
```

```python
# GOOD: Retry with backoff
from tenacity import retry, stop_after_delay, wait_exponential

@retry(stop=stop_after_delay(30), wait=wait_exponential(multiplier=1, max=5))
def wait_for_result(id):
    docs = DbManager.get_documents_by_field(collection, "id", id)
    assert len(docs) > 0, "Result not yet available"
    return docs[0]
```

## Pattern 2: Test Data Dependency

**Symptom**: Test fails when run in isolation but passes in full suite (or vice versa).

**Root Cause**: Test depends on data created by another test.

**Fix**:
- Each test class creates its own data in @BeforeClass/setup
- Each test class cleans up in @AfterClass/teardown
- Never share mutable state between test classes
- Use unique identifiers (timestamps, UUIDs) in test data

## Pattern 3: Shared State / ThreadLocal Issues

**Symptom**: Test fails only during parallel execution.

**Root Cause**: Static variables accessed across threads without synchronization.

**Fix**:
```java
// BAD: Shared static variable
private static String token;

// GOOD: ThreadLocal
private static ThreadLocal<String> token = new ThreadLocal<>();
```

## Pattern 4: External Service Dependency

**Symptom**: Test fails when external service (database, cache, third-party API) is slow or unavailable.

**Root Cause**: No timeout handling, no retry logic, tight coupling to service availability.

**Fix**:
```java
// Add retry logic
public static ValidatableResponse callWithRetry(Supplier<ValidatableResponse> apiCall, int maxRetries) {
    for (int i = 0; i < maxRetries; i++) {
        try {
            return apiCall.get();
        } catch (NoHttpResponseException e) {
            if (i == maxRetries - 1) throw e;
            Thread.sleep(1000);
        }
    }
    throw new RuntimeException("Max retries exceeded");
}
```

## Pattern 5: Date/Time Dependent

**Symptom**: Test fails on weekends, holidays, or at specific times of day.

**Root Cause**: Test uses current date/time and assumes specific conditions (e.g., business day, market hours).

**Fix**:
```python
# BAD: Uses today's date
query_date = date.today()

# GOOD: Find last valid business day
from src.utils.date_utils import get_previous_business_day
query_date = get_previous_business_day()
```

```java
// BAD: Hardcoded date
String targetDate = "2024-01-25";

// GOOD: Dynamic date lookup
String targetDate = DateUtils.getNextValidDate();
```

## Pattern 6: Order-Dependent Tests

**Symptom**: Test fails when execution order changes.

**Root Cause**: Test methods within a class depend on execution order without explicit dependencies.

**Fix**:
```java
// BAD: Relies on implicit ordering
@Test public void test_create() { ... }
@Test public void test_read() { ... }  // Assumes create ran first

// GOOD: Use priority or dependsOn
@Test(priority = 1) public void test_create() { ... }
@Test(priority = 2, dependsOnMethods = "test_create") public void test_read() { ... }

// BEST: API call in @BeforeClass, all @Test methods are independent assertions
```

## Pattern 7: Resource Contention

**Symptom**: Test fails when running multiple test suites in parallel.

**Root Cause**: Tests compete for same resource (port, file, database record).

**Fix**:
- Use dynamic port allocation
- Use unique test data per suite
- Lock shared resources with mutex/semaphore
- Use ThreadLocal for thread-specific resources

## Pattern 8: Stale Cache

**Symptom**: Test fails after deployment or config change, passes after manual cache clear.

**Root Cause**: Cached data doesn't reflect latest state.

**Fix**:
```java
@BeforeClass
public void setup() {
    // Clear relevant cache before test
    CacheManager.deleteKeys("prefix:*");
    // Or restart service if needed
    ServiceManager.restart("service-name");
}
```

## Pattern 9: Network Flakiness

**Symptom**: Sporadic connection timeout, connection reset, DNS resolution failures.

**Fix**:
- Increase connection timeout in HTTP client config
- Add retry with exponential backoff
- Use connection pooling
- Pre-warm connections in setup

## Pattern 10: Element Staleness (Mobile)

**Symptom**: StaleElementReferenceException in Appium tests.

**Root Cause**: Screen refreshed/transitioned, element reference is stale.

**Fix**:
```java
// BAD: Store element reference
WebElement button = driver.findElement(By.id("submit"));
// ... screen transitions ...
button.click();  // STALE

// GOOD: Re-locate on each use (ElementHandler pattern)
private WebElement submitButton() {
    return ElementHandler.getElement(driver, "submit");
}
// This is why the Screen pattern uses methods, not fields
```

## Flaky Test Detection Heuristics

A test is likely flaky if:
- Pass rate between 60-95% over last 20 runs
- Fails with different error messages across runs
- Fails more on CI than locally
- Fails more during peak hours
- Passes on immediate retry
- No code change correlates with failure onset
