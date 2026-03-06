# Test Naming Standards

## Java TestNG (API & App Automation)

### Test Methods
```
verify_<Expected>_<Behavior>_<Context>
```

Examples:
- `verify_Status_Code_Should_Be_200`
- `verify_Response_Contains_Order_Id`
- `verify_Error_Message_For_Invalid_Payload`
- `verify_Login_Screen_Is_Displayed`
- `verify_User_Can_Navigate_To_Dashboard`

Rules:
- Start with `verify_`
- Use underscores between words
- PascalCase within segments
- Descriptive but not overly long
- Matches @Description annotation content

### Test Classes
```
<Feature><Action>Test   or   <Feature><Scenario>
```

Examples:
- `CreateOrderTest`
- `PlaceOrderWithValidPayload`
- `LoginScreenTest`
- `DashboardNavigationTest`

### API Executors
```
<ServiceName>Executor
```
Method names: `camelCase` describing the API action
- `createOrder(payload)`
- `getOrderById(orderId)`
- `deleteResource(resourceId)`

### Screen Classes (Page Objects)
```
<Feature>Screen
```
- `LoginScreen`
- `DashboardScreen`
- `OrderDetailsScreen`

### TestNG Suite XML
```
testng-<Feature>.xml
testng-<Service>-<Scenario>.xml
```
- `testng-Login.xml`
- `testng-Orders-Regression.xml`

### Maven Profiles
```
<Service>-<Environment>-<Scope>
```
- `Orders-Stage-Regression`
- `Users-Stage`
- `Payments-Prod`

## Python pytest

### Test Functions
```python
def test_<what>_<condition>():
```

Examples:
- `test_order_creation_returns_correct_id`
- `test_data_comparison_matches_expected_csv`
- `test_invalid_input_raises_error`

### Test Classes
```python
class Test<Feature>:
```
- `TestOrderCreation`
- `TestDataComparison`
- `TestUserAuthentication`

### Fixtures
```python
def setup_<what>():
def <what>_fixture():
```
- `setup_test_data`
- `setup_comparison_data`
- `clear_cache_before_session`

### Test Files
```
test_<feature>.py
test_<what>_<action>.py
```
- `test_orders.py`
- `test_data_comparison.py`

## Allure Annotations

### Epic (Service Level)
- `Orders`, `Users`, `Payments`, `Authentication`, `Dashboard`

### Feature (Feature Level)
- `Order Placement`, `User Registration`, `Data Validation`

### Story (Scenario Level)
- `Valid order with default settings`, `User login with MFA`

### Severity Mapping
| Level | When to Use |
|-------|------------|
| BLOCKER | Status code, auth, core business logic |
| CRITICAL | Key response fields, data integrity |
| NORMAL | Response format, secondary fields |
| MINOR | Headers, metadata, non-functional |
| TRIVIAL | Cosmetic, logging |

## Branch Naming

```
ver/<description>    # Major version changes
feat/<description>   # New features (minor version)
bugfix/<description> # Bug fixes (patch version)
```
