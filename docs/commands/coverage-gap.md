# /qa:coverage-gap

Analyze test coverage gaps by comparing existing tests against endpoints, screens, or requirements.

## Usage

```
/qa:coverage-gap <service name, feature area, or "full project">
```

## Examples

```
/qa:coverage-gap TAP service
/qa:coverage-gap App-Automation login flow
/qa:coverage-gap full project
/qa:coverage-gap Bundle service endpoints
/qa:coverage-gap Quant signal generation
```

## What It Does

1. **Inventories existing tests** — scans your test directories, maps each test to its endpoint/screen/feature, identifies test types (positive, negative, edge)
2. **Inventories what should be tested** using coverage checklists:
   - **GET endpoints**: 8-point checklist (valid request, schema, params, pagination, empty result, 404, 401, response time)
   - **POST endpoints**: 8-point checklist (valid creation, schema match, missing fields, invalid types, duplicates, empty body, 401, resource ID)
   - **PUT/PATCH endpoints**: 7-point checklist
   - **DELETE endpoints**: 5-point checklist
   - **Mobile screens**: 10-point checklist (load, elements, forms, navigation, back, loading state, error state, empty state, rotation, keyboard)
   - **Data pipelines**: 7-point checklist (completeness, accuracy, timeliness, consistency, uniqueness, schema, edge cases)
3. **Calculates gaps** — compares existing vs required
4. **Prioritizes findings** — P0 critical gaps, P1 medium, P2 backlog

## Output

Saved to `doc/coverage-reports/<scope>-<YYYY-MM-DD>.md`

Includes:
- Coverage summary table (covered/total/percentage per dimension)
- Per-service coverage detail with status (Covered/Partial/MISSING)
- Critical gaps with risk assessment
- Suggested tests for each gap
- Recommendations (immediate, sprint goal, backlog)

## Tips

- Run from the project directory so it can scan your actual test files
- Start with a single service to get actionable results, rather than "full project"
- Combine with `/qa:api-scaffold` or `/qa:app-scaffold` to immediately fill identified gaps
