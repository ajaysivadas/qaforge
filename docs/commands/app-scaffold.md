# /qa:app-scaffold

Generate mobile app test scaffolding with page objects and UI test flows.

## Usage

```
/qa:app-scaffold <screen name, user flow, or feature description>
```

## Examples

```
/qa:app-scaffold Login screen with email, password, and forgot password link
/qa:app-scaffold Settings screen with theme toggle and notification preferences
/qa:app-scaffold Checkout flow: cart -> shipping -> payment -> confirmation
/qa:app-scaffold Profile screen with avatar upload and edit fields
```

## What It Generates

| File | Purpose |
|------|---------|
| Screen class | Page object with elements and actions |
| Test class | Test with driver lifecycle |
| TestNG Suite XML | Suite definition |
| Maven Profile | Run configuration |

## Cross-Platform Support

The command generates:
- Android locators (accessibility IDs, XPaths)
- iOS locators (accessibility IDs, XPaths)
- Platform-specific handling flags for date pickers, keyboards, gestures

## Tips

- Provide accessibility IDs if you have them — produces more stable locators
- Describe the full user flow for multi-screen test generation
- Provide a screenshot path for visual element identification
