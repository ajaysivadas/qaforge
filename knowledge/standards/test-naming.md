# Test Naming Standards

## Java TestNG (API & App Automation)

### Test Methods
```
verify_<Expected>_<Behavior>_<Context>
```

Examples:
- `verify_Status_Code_Should_Be_200`
- `verify_Response_Contains_Trade_Id`
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
- `CreateCorrectStrategy`
- `PlaceOrderWithValidPayload`
- `LoginScreenTest`
- `DashboardNavigationTest`

### API Executors
```
<ServiceName>Executor
```
Method names: `camelCase` describing the API action
- `createTradeIdea(payload)`
- `getOrderById(orderId)`
- `deletePosition(positionId)`

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
- `testng-Tap-Stage-Regression.xml`

### Maven Profiles
```
<Service>-<Environment>-<Scope>
```
- `Tap-Stage-Regression`
- `Tis-Stage`
- `Bundle`

## Python pytest (Quant Research)

### Test Functions
```python
def test_<what>_<condition>():
```

Examples:
- `test_signal_generation_produces_correct_strike`
- `test_backtest_trades_match_expected_csv`
- `test_smd_ohlc_matches_backtest_data`
- `test_invalid_variant_id_raises_error`

### Test Classes
```python
class Test<Feature>:
```
- `TestSignalGeneration`
- `TestBacktestComparison`
- `TestSmdObservability`

### Fixtures
```python
def setup_<what>():
def <what>_fixture():
```
- `setup_signals`
- `setup_backtestdata`
- `clear_redis_before_session`
- `ensure_vm_running_before_session`

### Test Files
```
test_<feature>.py
test_<what>_<action>.py
```
- `test_bundle.py`
- `test_trades_comparison.py`
- `test_index_comparison.py`

## Allure Annotations

### Epic (Service Level)
- `TAP`, `TIS`, `TMS`, `TWS`, `Bundle`, `Quant`, `SMD`, `UserPnl`

### Feature (Feature Level)
- `Order Placement`, `Signal Generation`, `Trade Monitoring`, `Backtest Validation`

### Story (Scenario Level)
- `Valid order with market price`, `Signal for NIFTY iron condor`

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

Enforced by GitHub Actions in all repositories.
