# Data Validation Testing Patterns

## Pipeline Validation Strategy

For data pipelines (databases, caches, message queues, file stores):

### Source-to-Target Comparison
```
Source Data (Input) -> Pipeline Processing -> Target Data (Output)
                                                 |
                                           Compare against
                                                 |
                                         Expected Data (CSV/JSON)
```

### Validation Layers

1. **Completeness**: All expected records exist in target
2. **Accuracy**: Field values match expected values (within tolerance)
3. **Timeliness**: Data arrives within expected time window
4. **Consistency**: Same data across different stores (DB + Cache + Search Index)
5. **Uniqueness**: No duplicate records

## Numeric Comparison with Tolerance

```python
# For financial/scientific data, never use exact equality
def assert_value_match(actual, expected, tolerance=0.01):
    """Compare numeric values with absolute tolerance."""
    diff = abs(actual - expected)
    assert diff <= tolerance, f"Value mismatch: {actual} vs {expected} (diff: {diff})"

# For percentage-based tolerance
def assert_within_percentage(actual, expected, pct=1.0):
    """Compare values within percentage tolerance."""
    if expected == 0:
        assert actual == 0
        return
    diff_pct = abs((actual - expected) / expected) * 100
    assert diff_pct <= pct, f"Diff {diff_pct:.2f}% exceeds {pct}% threshold"
```

```java
// Java equivalent
public static void assertWithinTolerance(double actual, double expected, double tolerance) {
    double diff = Math.abs(actual - expected);
    Assert.assertTrue(diff <= tolerance,
        String.format("Value mismatch: %.4f vs %.4f (diff: %.4f)", actual, expected, diff));
}
```

## Record Comparison Pattern

```python
def compare_records(actual_records, expected_records, key_fields, compare_fields):
    """
    Generic record comparison.
    Match on: key_fields (e.g., ['id', 'timestamp'])
    Compare: compare_fields (e.g., ['amount', 'status', 'category'])
    """
    results = {"matched": 0, "mismatched": 0, "missing": 0, "extra": 0}

    expected_map = {
        tuple(getattr(r, k) for k in key_fields): r
        for r in expected_records
    }

    for record in actual_records:
        key = tuple(getattr(record, k) for k in key_fields)
        expected = expected_map.pop(key, None)
        if not expected:
            results["extra"] += 1
            continue
        if all(getattr(record, f) == getattr(expected, f) for f in compare_fields):
            results["matched"] += 1
        else:
            results["mismatched"] += 1

    results["missing"] = len(expected_map)
    return results
```

## Cross-Source Comparison

```python
def compare_data_sources(primary_data, source_b_data, source_c_data, threshold):
    """Compare a primary data source against secondary sources."""
    mismatches = []
    for key in primary_data:
        primary_val = primary_data[key]
        b_val = source_b_data.get(key)
        c_val = source_c_data.get(key)

        if b_val and abs(primary_val - b_val) > threshold:
            mismatches.append({"key": key, "primary": primary_val, "source_b": b_val})
        if c_val and abs(primary_val - c_val) > threshold:
            mismatches.append({"key": key, "primary": primary_val, "source_c": c_val})

    return mismatches
```

## JSON Schema Validation

```python
from jsonschema import validate, ValidationError

def validate_response_schema(response_json, schema):
    """Validate API response against JSON schema."""
    try:
        validate(instance=response_json, schema=schema)
    except ValidationError as e:
        raise AssertionError(f"Schema validation failed: {e.message}")

# Example schema
USER_SCHEMA = {
    "type": "object",
    "required": ["id", "email", "name", "created_at"],
    "properties": {
        "id": {"type": "integer"},
        "email": {"type": "string", "format": "email"},
        "name": {"type": "string", "minLength": 1},
        "created_at": {"type": "string", "format": "date-time"},
        "status": {"type": "string", "enum": ["active", "inactive", "suspended"]},
    },
    "additionalProperties": False,
}
```

## Date/Time Validation

```python
from datetime import datetime, timezone

def assert_timestamp_valid(timestamp_str, fmt="%Y-%m-%dT%H:%M:%SZ"):
    """Verify a timestamp string is parseable and reasonable."""
    parsed = datetime.strptime(timestamp_str, fmt)
    assert parsed.year >= 2020, f"Timestamp too old: {timestamp_str}"
    assert parsed <= datetime.now(timezone.utc).replace(tzinfo=None), f"Timestamp in future: {timestamp_str}"
    return parsed

def assert_timestamps_ordered(records, field="created_at"):
    """Verify records are in chronological order."""
    timestamps = [r[field] for r in records]
    assert timestamps == sorted(timestamps), "Records not in chronological order"
```

## Data Freshness Tests

```python
def assert_data_fresh(document, max_age_minutes=15):
    """Ensure data was updated within the expected time window."""
    updated_at = document.get("updated_at")
    assert updated_at is not None, "Missing updated_at timestamp"
    age = (datetime.now() - updated_at).total_seconds() / 60
    assert age <= max_age_minutes, f"Data is {age:.1f} minutes old (max: {max_age_minutes})"
```

## Allure Report Formatting for Data Tests

```python
def format_comparison_table(results):
    """Generate HTML table for Allure report."""
    rows = []
    for r in results:
        color = "#d4edda" if r["match"] else "#f8d7da"
        rows.append(f"<tr style='background:{color}'>"
                    f"<td>{r['field']}</td>"
                    f"<td>{r['expected']}</td>"
                    f"<td>{r['actual']}</td>"
                    f"<td>{r['diff']}</td></tr>")
    return f"<table><tr><th>Field</th><th>Expected</th><th>Actual</th><th>Diff</th></tr>{''.join(rows)}</table>"
```

## Test Data Isolation

- Each test generates or references unique data
- Use timestamps or UUIDs in record IDs
- Clean up created records in teardown
- Never modify production-like data in shared tables
- Use separate test collections/schemas when possible
