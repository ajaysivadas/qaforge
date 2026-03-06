# /qa:coverage-gap

Analyze test coverage gaps by comparing existing tests against endpoints, screens, or requirements.

## Usage

```
/qa:coverage-gap <service name, feature area, or "full project">
```

## Examples

```
/qa:coverage-gap orders service
/qa:coverage-gap login and authentication flow
/qa:coverage-gap full project
/qa:coverage-gap payment gateway endpoints
```

## What It Does

1. **Inventories existing tests** — scans test directories, maps each test to its endpoint/screen/feature
2. **Applies coverage checklists** from the knowledge base:
   - GET endpoints: 8-point checklist
   - POST endpoints: 8-point checklist
   - PUT/PATCH: 7-point checklist
   - DELETE: 5-point checklist
   - Mobile screens: 10-point checklist
   - Data pipelines: 7-point checklist
3. **Calculates gaps** and **prioritizes findings** (P0 critical, P1 medium, P2 backlog)

## Output

Saved to `doc/coverage-reports/<scope>-<YYYY-MM-DD>.md`

## Tips

- Start with a single service to get actionable results
- Combine with `/qa:api-scaffold` or `/qa:app-scaffold` to immediately fill identified gaps
