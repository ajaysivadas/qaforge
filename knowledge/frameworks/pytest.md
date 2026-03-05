# Python pytest Framework Knowledge

## Test Structure

```python
import pytest
import allure
from src.managers.firestore_manager import FirestoreManager
from src.managers.redis_manager import RedisManager
from src.utils.config_reader import ConfigReader

@allure.epic("Service Name")
@allure.feature("Feature Name")
class TestFeatureName:

    @pytest.fixture(autouse=True, scope="class")
    def setup(self, request):
        """Class-level setup — prepare test data."""
        request.cls.data = DataPreparation.prepare_data()
        yield
        # Teardown
        cleanup()

    @allure.story("Scenario description")
    @allure.severity(allure.severity_level.CRITICAL)
    def test_expected_behavior(self, setup_data):
        """Verify the expected behavior occurs."""
        result = some_operation(setup_data)
        assert result.status == "expected", f"Expected 'expected', got '{result.status}'"

    @allure.story("Negative scenario")
    @allure.severity(allure.severity_level.NORMAL)
    def test_invalid_input_returns_error(self):
        """Verify invalid input is handled correctly."""
        with pytest.raises(ValueError):
            some_operation(invalid_data)
```

## Component vs Manager Pattern

- **Components** (`src/components/`): Singleton GCP service clients
  - BigQueryComponent, FirestoreComponent, RedisComponent, PubSubComponent, CloudStorageComponent
  - Handle client initialization and authentication only
  - NEVER use components directly in tests

- **Managers** (`src/managers/`): Business logic wrappers
  - FirestoreManager, RedisManager, BigQueryManager, PubSubManager, StorageManager
  - Use managers in tests for all data operations

```python
# CORRECT
from src.managers.firestore_manager import FirestoreManager
docs = FirestoreManager.get_documents_by_field(collection, field, value)

# WRONG — never use components directly
from src.components.firestore_component import FirestoreComponent
```

## Fixture Patterns

```python
# conftest.py

@pytest.fixture(scope="session")
def ensure_vm_running_before_session():
    """Start GCE VM before test session, stop after."""
    start_vm()
    yield
    stop_vm()

@pytest.fixture(scope="session")
def clear_redis_before_session():
    """Clean Redis state before running tests."""
    RedisManager.flush_keys(pattern="test:*")
    yield

@pytest.fixture(scope="module")
def setup_signals():
    """Prepare signal generation test environment."""
    cp_update()
    restart_container()
    data = DataPreparation.prepare_data()
    yield data

@pytest.fixture(scope="function")
def setup_backtestdata():
    """Set up backtest comparison data per test."""
    data = fetch_backtest_data()
    yield data
    cleanup_backtest_data()

# Custom CLI options
def pytest_addoption(parser):
    parser.addoption("--variant_id", action="store", default=None)
    parser.addoption("--start_date", action="store", default=None)
    parser.addoption("--expiry_date", action="store", default=None)
    parser.addoption("--query_date", action="store", default=None)
    parser.addoption("--index_type", action="store", default=None)

@pytest.fixture
def variant_id(request):
    return request.config.getoption("--variant_id")
```

## Signal Generation Test Flow

```python
def test_signal_generation(setup_signals):
    """
    1. cp_update() — update control parameters in Firestore
    2. restart_container() — reset signal generation container
    3. DataPreparation.prepare_data() — fetch test data
    4. publish_bundle_smd_event() — publish SMD events via PubSub
    5. Verify signals in Firestore and state in Redis
    6. Assert strikes, entry prices, pending decisions
    """
    data = setup_signals
    publish_bundle_smd_event(data.topic, data.payload)
    signals = FirestoreManager.get_documents_by_field(
        collection, "variant_id", data.variant_id
    )
    assert len(signals) > 0, "No signals generated"
    assert signals[0]["strike"] == data.expected_strike
```

## Backtest Test Flow

```python
def test_backtest_comparison(setup_backtestdata):
    """Compare actual trades from Firestore against expected CSV from Cloud Storage."""
    actual = FirestoreManager.get_backtest_trades(variant_id)
    expected = StorageManager.download_csv(bucket, path)
    comparison = compare_trades(actual, expected)
    assert comparison.mismatches == 0, f"Found {comparison.mismatches} mismatches"
```

## SMD Observability Test Flow

```python
@pytest.mark.parametrize("index", ["NIFTY", "SENSEX"])
def test_smd_vs_backtest(query_date, index):
    """Compare SMD OHLC against backtest data."""
    smd_data = BigQueryManager.query_smd(index, query_date)
    bt_data = BigQueryManager.query_backtest(index, query_date)
    differences = compare_ohlc(smd_data, bt_data)
    assert len(differences) == 0, format_differences(differences)
```

## Configuration

```python
# .env file drives all config
from src.utils.config_reader import ConfigReader

project_id = ConfigReader.get_project_id()
bucket = ConfigReader.get_backtest_qa_cloudbucket_name()
redis_uri = ConfigReader.get_redis_uri()
report_link = ConfigReader.get_allure_report_link("smd-observability")
```

## Allure Integration

```python
import allure

# Step-level logging
with allure.step("Publish SMD event"):
    publish_event(topic, payload)

# Attach data to report
allure.attach(json.dumps(data, indent=2), "Response Data", allure.attachment_type.JSON)

# HTML formatted tables in reports
allure.attach(html_table, "Comparison Results", allure.attachment_type.HTML)

# Use allure_formatter.py constants for styling
from src.utils.allure_formatter import STATUS_SUCCESS, STATUS_ERROR, BG_SUCCESS
```

## Project Structure

```
src/
├── components/          # Singleton GCP service clients
├── managers/            # Business logic wrappers
├── signalGeneration/    # Signal validation logic
├── backtest/            # Backtest comparison utilities
├── mds/                 # Market data service utilities
├── scripts/             # CI helper scripts
└── utils/
    ├── config_reader.py
    ├── allure_formatter.py
    └── assertions.py

tests/
├── backtest/            # Backtest comparison tests
├── signalGeneration/    # Signal generation tests
├── holidayObservability/ # Holiday sync tests
├── smdObservability/    # SMD data validation tests
└── conftest.py          # Shared fixtures
```

## Running Tests

```bash
pytest tests/                                    # All tests
pytest tests/backtest/test_trades_comparison.py  # Specific module
pytest tests/ --alluredir=allure-results         # With Allure
pytest tests/smdObservability/ --query_date=2024-01-15 --index_type=NIFTY
```
