# /qa:app-scaffold

Generate mobile app test scaffolding with page objects and UI test flows.

## Usage

```
/qa:app-scaffold <screen name, user flow, or feature description>
```

## Examples

```
/qa:app-scaffold Login screen with email, password, and OTP
/qa:app-scaffold Portfolio dashboard showing holdings and P&L
/qa:app-scaffold Order placement flow: select strategy -> configure -> confirm -> verify
/qa:app-scaffold Settings screen with theme toggle and notification preferences
```

## What It Generates

| File | Location | Purpose |
|------|----------|---------|
| Screen class | `Screens/<Feature>/FeatureScreen.java` | Page object with elements and actions |
| Test class | `src/test/java/.../<Feature>Test.java` | Test with driver lifecycle |
| TestNG Suite XML | `test-suite/testng-Feature.xml` | Suite definition |
| Maven Profile | `pom.xml` | Run configuration |

## Key Patterns

The generated code follows these exact conventions from your framework:

- **Screen classes** extend `MobileActions`
- **Elements are private methods** (not fields) — prevents staleness
- **ElementHandler.getElement(driver, android, ios)** for cross-platform locators
- **Action methods** are verb-based: `clickButton()`, `enterText()`, `isScreenDisplayed()`
- **Test classes** use `DriverManager.initializeDriver()` in `@BeforeClass`
- **Screen objects** are static class variables
- **Test methods** use priority ordering and Allure annotations

## Cross-Platform Support

The command generates:
- Android locators (accessibility IDs, XPaths)
- iOS locators (accessibility IDs, XPaths)
- Platform-specific handling flags for date pickers, keyboards, gestures

## Tips

- Provide accessibility IDs if you have them — produces more stable locators
- Describe the full user flow for multi-screen test generation
- Provide a screenshot path for visual element identification
