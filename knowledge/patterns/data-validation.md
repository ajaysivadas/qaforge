# Data Validation Testing Patterns

## Pipeline Validation Strategy

For data pipelines (BigQuery, Firestore, Redis, PubSub):

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
4. **Consistency**: Same data across different stores (Firestore + Redis + BigQuery)
5. **Uniqueness**: No duplicate records

## Numeric Comparison with Tolerance

```python
# For financial data, never use exact equality
def assert_price_match(actual, expected, tolerance=0.01):
    """Compare prices with tolerance for floating point."""
    diff = abs(actual - expected)
    assert diff <= tolerance, f"Price mismatch: {actual} vs {expected} (diff: {diff})"

# For percentage-based tolerance
def assert_within_percentage(actual, expected, pct=1.0):
    """Compare values within percentage tolerance."""
    if expected == 0:
        assert actual == 0
        return
    diff_pct = abs((actual - expected) / expected) * 100
    assert diff_pct <= pct, f"Diff {diff_pct:.2f}% exceeds {pct}% threshold"
```

## OHLC Data Validation

```python
# Market data sanity checks
def validate_ohlc(candle):
    assert candle.high >= candle.low, "High must be >= Low"
    assert candle.high >= candle.open, "High must be >= Open"
    assert candle.high >= candle.close, "High must be >= Close"
    assert candle.low <= candle.open, "Low must be <= Open"
    assert candle.low <= candle.close, "Low must be <= Close"
    assert candle.volume >= 0, "Volume must be non-negative"
    assert candle.open > 0, "Open must be positive"
```

## Cross-Source Comparison Pattern

```python
# Compare SMD data against multiple sources
def compare_data_sources(smd_data, source_b_data, source_c_data, threshold):
    mismatches = []
    for timestamp in smd_data:
        smd_val = smd_data[timestamp]
        b_val = source_b_data.get(timestamp)
        c_val = source_c_data.get(timestamp)

        if b_val and abs(smd_val - b_val) > threshold:
            mismatches.append({"timestamp": timestamp, "smd": smd_val, "source_b": b_val})
        if c_val and abs(smd_val - c_val) > threshold:
            mismatches.append({"timestamp": timestamp, "smd": smd_val, "source_c": c_val})

    return mismatches
```

## Backtest Trade Comparison

```python
# Compare actual trades against expected
def compare_trades(actual_trades, expected_trades):
    """
    Match on: variant_id + timestamp + strike
    Compare: entry_price, exit_price, quantity, pnl, position_type
    """
    results = {"matched": 0, "mismatched": 0, "missing": 0, "extra": 0}

    expected_map = {(t.variant_id, t.timestamp, t.strike): t for t in expected_trades}

    for trade in actual_trades:
        key = (trade.variant_id, trade.timestamp, trade.strike)
        expected = expected_map.pop(key, None)
        if not expected:
            results["extra"] += 1
            continue
        if trades_match(trade, expected):
            results["matched"] += 1
        else:
            results["mismatched"] += 1

    results["missing"] = len(expected_map)
    return results
```

## Signal Validation

```python
# Verify signal generation correctness
def validate_signal(signal, expected):
    assert signal["strike"] == expected["strike"], "Strike mismatch"
    assert signal["position_type"] == expected["position_type"], "Position type mismatch"
    assert_price_match(signal["entry_price"], expected["entry_price"])
    assert signal["status"] in ["PENDING", "ACTIVE", "COMPLETED"]
```

## Data Freshness Tests

```python
# Verify data is recent enough
def assert_data_fresh(document, max_age_minutes=15):
    """Ensure data was updated within the expected time window."""
    updated_at = document.get("updated_at")
    assert updated_at is not None, "Missing updated_at timestamp"
    age = (datetime.now() - updated_at).total_seconds() / 60
    assert age <= max_age_minutes, f"Data is {age:.1f} minutes old (max: {max_age_minutes})"
```

## Allure Report Formatting for Data Tests

```python
from src.utils.allure_formatter import STATUS_SUCCESS, STATUS_ERROR

def format_comparison_table(results):
    """Generate HTML table for Allure report."""
    rows = []
    for r in results:
        color = STATUS_SUCCESS if r["match"] else STATUS_ERROR
        rows.append(f"<tr style='background:{color}'>"
                    f"<td>{r['field']}</td>"
                    f"<td>{r['expected']}</td>"
                    f"<td>{r['actual']}</td>"
                    f"<td>{r['diff']}</td></tr>")
    return f"<table><tr><th>Field</th><th>Expected</th><th>Actual</th><th>Diff</th></tr>{''.join(rows)}</table>"
```

## Test Data Isolation

- Each test generates or references unique data
- Use timestamps or UUIDs in document IDs
- Clean up created documents in teardown
- Never modify production-like data in shared collections
- Use separate test collections/buckets when possible
