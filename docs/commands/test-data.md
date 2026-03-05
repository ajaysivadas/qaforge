# /qa:test-data

Generate test data for various scenarios and data stores.

## Usage

```
/qa:test-data <data description, schema reference, or POJO class name>
```

## Examples

```
/qa:test-data TradeIdeaRequest POJO - positive, negative, and boundary cases
/qa:test-data Order payload with strategyType, strikes, and quantities
/qa:test-data Firestore documents for backtest expected trades
/qa:test-data Redis state for NIFTY option chain with 3 expiries
/qa:test-data CSV file for signal comparison test
```

## What It Generates

### Data Formats

| Format | When Used |
|--------|-----------|
| JSON payloads | API request/response test data |
| Java DataProvider | TestNG parameterized tests |
| Python parametrize | pytest parameterized tests |
| Firestore documents | Database fixtures |
| Redis commands | Cache state setup |
| CSV files | Backtest/quant test data |
| BigQuery INSERT | Data pipeline test rows |

### Scenario Coverage

For each schema, generates data covering:
- **Positive** — valid data, multiple valid combinations
- **Negative** — missing required fields (one at a time), wrong data types, null values
- **Edge** — min/max values, special characters, unicode, empty strings
- **Boundary** — at exact limits, just below/above limits

### Setup/Teardown Code

Also generates code to load and clean up data using your project's managers:
```java
FirestoreManager.createDocument(collection, docId, dataMap);
RedisManager.getInstance().set(key, value);
```
```python
FirestoreManager.set_document(collection, doc_id, data)
RedisManager.set(key, value)
```

## Tips

- Reference an existing POJO class for accurate schema matching
- Specify the target data store for correctly formatted output
- Combine with `/qa:test-cases` — generate cases first, then data for each case
