---
name: qa:test-data
description: Generate test data for scenarios including API payloads, database fixtures, Redis state, Firestore documents, and CSV test data.
---

# QA Test Data Generator

Generate test data for various scenarios and data stores.

## Input

$ARGUMENTS

If no argument is provided, ask the user for:
- What data is needed
- Schema or existing POJO/model reference
- Scenarios to cover (positive, negative, edge)
- Target data store

## Knowledge Base

Read before generating:
- `~/.claude/qaforge-knowledge/patterns/data-validation.md` — data validation patterns, tolerance handling
- The relevant framework file — to match data provider patterns

## Instructions

### Step 1: Understand Schema

If a POJO/model class is referenced, read it. If described, infer the schema.

### Step 2: Generate Data Sets

For each scenario type:
- **Positive**: Valid data, multiple valid combinations
- **Negative**: Missing fields, wrong types, null values
- **Edge**: Min/max values, special characters, unicode
- **Boundary**: At limits, just below/above limits

### Step 3: Format for Target

**Java TestNG DataProvider:**
```java
@DataProvider(name = "testData")
public Object[][] testData() {
    return new Object[][] {
        { "scenario", payload, expectedResult },
    };
}
```

**Python pytest parametrize:**
```python
@pytest.mark.parametrize("scenario,data,expected", [...])
```

**JSON fixtures**, **Firestore documents**, **Redis state**, **CSV files**, **BigQuery rows** — as appropriate.

### Step 4: Generate Setup/Teardown

Provide code to load and clean up the data using the project's existing managers (FirestoreManager, RedisManager, etc.).

### Step 5: Save

Present data and ask where to save. Write to appropriate location.
