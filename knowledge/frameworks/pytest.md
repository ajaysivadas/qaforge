# Python pytest Framework Knowledge

## Test Structure

```python
import pytest
import allure

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

- **Components** (`src/components/`): Singleton service clients (database, cache, cloud, message queue)
  - Handle client initialization and authentication only
  - NEVER use components directly in tests

- **Managers** (`src/managers/`): Business logic wrappers around components
  - Use managers in tests for all data operations

```python
# CORRECT
from src.managers.db_manager import DbManager
docs = DbManager.get_documents_by_field(collection, field, value)

# WRONG — never use components directly
from src.components.db_component import DbComponent
```

## Fixture Patterns

```python
# conftest.py

@pytest.fixture(scope="session")
def ensure_service_running():
    """Start required service before test session, stop after."""
    start_service()
    yield
    stop_service()

@pytest.fixture(scope="session")
def clear_cache_before_session():
    """Clean cache state before running tests."""
    CacheManager.flush_keys(pattern="test:*")
    yield

@pytest.fixture(scope="module")
def setup_test_data():
    """Prepare test environment for the module."""
    update_config()
    restart_service()
    data = DataPreparation.prepare_data()
    yield data

@pytest.fixture(scope="function")
def setup_comparison_data():
    """Set up comparison data per test."""
    data = fetch_comparison_data()
    yield data
    cleanup_comparison_data()

# Custom CLI options
def pytest_addoption(parser):
    parser.addoption("--variant_id", action="store", default=None)
    parser.addoption("--start_date", action="store", default=None)
    parser.addoption("--query_date", action="store", default=None)

@pytest.fixture
def variant_id(request):
    return request.config.getoption("--variant_id")
```

## Configuration

```python
# .env file drives all config
from src.utils.config_reader import ConfigReader

project_id = ConfigReader.get_project_id()
bucket = ConfigReader.get_storage_bucket_name()
cache_uri = ConfigReader.get_cache_uri()
```

## Allure Integration

```python
import allure

# Step-level logging
with allure.step("Publish event to message queue"):
    publish_event(topic, payload)

# Attach data to report
allure.attach(json.dumps(data, indent=2), "Response Data", allure.attachment_type.JSON)

# HTML formatted tables in reports
allure.attach(html_table, "Comparison Results", allure.attachment_type.HTML)
```

## Typical Project Structure

```
src/
├── components/          # Singleton service clients
├── managers/            # Business logic wrappers
├── scripts/             # CI helper scripts
└── utils/
    ├── config_reader.py
    ├── allure_formatter.py
    └── assertions.py

tests/
├── conftest.py          # Global fixtures
├── <feature>/
│   ├── conftest.py      # Feature fixtures
│   └── test_*.py        # Test modules
└── fixtures/            # Shared test data files
```

## Running Tests

```bash
pytest tests/                                    # All tests
pytest tests/feature/test_specific.py            # Specific module
pytest tests/ --alluredir=allure-results         # With Allure
pytest tests/feature/ --query_date=2024-01-15    # With custom params
```
