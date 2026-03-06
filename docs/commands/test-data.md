# /qa:test-data

Generate test data for various scenarios and data stores.

## Usage

```
/qa:test-data <data description, schema reference, or model class name>
```

## Examples

```
/qa:test-data OrderRequest POJO - positive, negative, and boundary cases
/qa:test-data user payload with name, email, role, and preferences
/qa:test-data database fixtures for expected order history
/qa:test-data cache state for product catalog with 3 categories
/qa:test-data CSV file for data comparison test
```

## Supported Formats

| Format | When Used |
|--------|-----------|
| JSON payloads | API request/response test data |
| Java DataProvider | TestNG parameterized tests |
| Python parametrize | pytest parameterized tests |
| Database documents | DB fixtures |
| Cache commands | Cache state setup |
| CSV files | Data comparison tests |
| SQL INSERT | Data pipeline test rows |

## Tips

- Reference an existing POJO/model class for accurate schema matching
- Specify the target data store for correctly formatted output
- Combine with `/qa:test-cases` — generate cases first, then data for each case
