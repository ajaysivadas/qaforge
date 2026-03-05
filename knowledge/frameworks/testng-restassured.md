# TestNG + RestAssured Framework Knowledge

## Test Class Structure

Every API test class follows this exact pattern:

```java
@Epic("ServiceName")
@Feature("FeatureName")
@Story("Scenario description")
@Severity(SeverityLevel.CRITICAL)
public class TestClassName {
    private static ValidatableResponse validatableresponse;
    private static ResponsePojo response;

    // Private callback method for Allure step wrapping
    private void callApi() {
        RequestPojo payload = RequestPayloadFactory.buildPayload();
        validatableresponse = ServiceExecutor.apiMethod(payload, param);
    }

    @BeforeClass
    public void beforeTest() {
        LoggerManager.getInstance().info("Test description");
        AllureManager.executeStep("Step-1: Call API", this::callApi);
        response = validatableresponse.extract().as(ResponsePojo.class);
    }

    @Test
    @Severity(SeverityLevel.BLOCKER)
    @Description("Verify status code should be 200")
    public void verify_Status_Code_Should_Be_200() {
        Assertions.assertStatusCode(validatableresponse, HttpStatusCode.OK, "message");
    }

    @Test
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify response field value")
    public void verify_Response_Field_Value() {
        Assertions.assertEquals(response.getField(), expectedValue, "Field mismatch");
    }

    @AfterClass
    public void afterTest() {
        AllureManager.executeStep("Clean Up", this::cleanUp);
    }
}
```

## Key Rules

1. **API calls happen in @BeforeClass**, NOT in @Test methods
2. **@Test methods only contain assertions** — one assertion per test method
3. **Response fields are static class variables** so they persist across test methods
4. **Private callback methods** wrap API calls for Allure step integration
5. **Method naming**: `verify_Expected_Behavior_Description` (snake_case with underscores)
6. **Every test method has**: @Severity, @Description, @Test annotations

## API Executor Pattern

```java
public class ServiceNameExecutor {
    public static synchronized ValidatableResponse methodName(Object payload, String param) {
        return HttpRequest.postRequest(BaseUri.ServiceName, payload,
            EndPoint.ServiceEndpoint.addPathParam(param));
    }
}
```

- All methods are `public static synchronized`
- Return `ValidatableResponse`
- Use `HttpRequest` static methods (getRequest, postRequest, putRequest, deleteRequest, patchRequest)
- Pass `BaseUri` enum, payload, and `EndPoint` enum

## HTTP Request Chain

`HttpRequest` -> `DeleteRequests` -> `PutRequests` -> `PostRequests` -> `GetRequests` -> `PatchRequests`

Each provides 10-15 overloaded methods supporting: BaseUri, EndPoint, Object body, HashMap headers, query params, custom auth tokens.

## Endpoint Pattern

```java
// EndPoint enum uses ThreadLocal for path params
EndPoint.SomeEndpoint.addPathParam(id)  // Returns EndPoint for chaining
EndPoint.SomeEndpoint.getResource()      // Resolves thread-specific path
```

## Assertion Pattern

Always use the custom `Assertions` class (NOT raw TestNG/AssertJ):

```java
Assertions.assertStatusCode(response, HttpStatusCode.OK, "message");
Assertions.assertEquals(actual, expected, "message");
Assertions.assertTrue(condition, "message");
Assertions.assertNotNull(object, "message");
Assertions.assertSoftFail(actual, expected, "message");  // Non-blocking
```

Every assertion integrates with Allure and attaches actual/expected values on failure.

## TestNG Suite XML

```xml
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Suite Name" parallel="classes" thread-count="5">
    <listeners>
        <listener class-name="MarketFeed.Api_Test.Reports.Listeners.ServiceListener"/>
    </listeners>
    <test name="Test Name">
        <classes>
            <class name="MarketFeed.Api_Test.ServiceName.Feature.TestClass"/>
        </classes>
    </test>
</suite>
```

## Maven Profile

```xml
<profile>
    <id>ProfileName</id>
    <properties>
        <suiteXmlFile>test-suite/path/testng-suite.xml</suiteXmlFile>
    </properties>
</profile>
```

## Pre-Requisite Validation

Listeners run on `onStart(ISuite)` -> PreRequisiteValidator:
1. Checks Redis for valid future expiry option chain data
2. Verifies GCP App Engine services are SERVING
3. On failure: Discord alert + System.exit(0)

## Common Severity Mappings

- `BLOCKER`: Status code assertions, authentication, critical business logic
- `CRITICAL`: Response body key fields, data integrity
- `NORMAL`: Response format, optional fields, metadata
- `MINOR`: Logging, headers, non-functional checks

## Package Structure

```
src/main/java/MarketFeed/Api_Test/
├── ApiExecutors/<Service>/     # API call methods
├── Assertions/                 # Custom assertion methods
├── Base/
│   ├── HttpRequests/           # HTTP method chain + auth
│   ├── URI/                    # BaseUri + EndPoint enums
│   └── TestData/               # DataProviders, constants
├── DatabasePojo/               # Firestore POJOs
├── Payloads/
│   ├── RequestPayload/         # Payload builders
│   └── ResponsePayload/        # Expected response templates
├── RequestPojo/                # Request body objects
├── ResponsePojo/               # Response deserialization objects
├── Reports/Listeners/          # TestNG listeners per service
└── Utils/
    ├── Managers/               # AllureManager, FirestoreManager, RedisManager...
    ├── Instances/              # Singleton clients (Firestore, Firebase, Redis...)
    └── Handlers/               # PreRequisiteValidator, environment detection
```
