# Mobile Testing Patterns

## Screen Verification Checklist

For every screen, verify:

### Visual
- [ ] Screen loads within 3 seconds
- [ ] All expected elements visible
- [ ] Text is readable (not truncated, overlapping)
- [ ] Images/icons load correctly
- [ ] Layout adapts to screen size
- [ ] Orientation change doesn't break layout

### Interaction
- [ ] All tappable elements respond to tap
- [ ] Input fields accept text
- [ ] Keyboard appears/dismisses correctly
- [ ] Scroll works for long content
- [ ] Back navigation works
- [ ] Pull-to-refresh (if applicable)
- [ ] Swipe gestures (if applicable)

### State
- [ ] Screen state persists on background/foreground
- [ ] Data refreshes on return
- [ ] Loading states shown during API calls
- [ ] Error states displayed on failure
- [ ] Empty states for no data

## User Flow Test Patterns

### Happy Path Flow
```
Launch App -> Navigate to Feature -> Perform Action -> Verify Result -> Navigate Back
```

### Error Handling Flow
```
Launch App -> Navigate to Feature -> Trigger Error -> Verify Error UI -> Retry -> Verify Recovery
```

### Interruption Flow
```
Start Action -> Background App -> Foreground App -> Verify State Preserved -> Complete Action
```

## Element Location Strategy (Priority Order)

1. **Accessibility ID** — best: cross-platform, stable, semantic
2. **Test ID** (contentDescription on Android, accessibilityIdentifier on iOS) — reliable
3. **Text content** — fragile if text changes, but readable
4. **XPath with attributes** — `//Button[@text='Login']` — moderate stability
5. **XPath with hierarchy** — `//View/View[2]/Button` — AVOID, breaks on layout changes
6. **Index-based** — `elements[0]` — NEVER use in production tests

## Wait Strategies

```java
// GOOD: Explicit wait for specific condition
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
wait.until(ExpectedConditions.visibilityOf(element));

// GOOD: Poll for element with retry
boolean found = false;
for (int i = 0; i < 5; i++) {
    if (isElementDisplayed(element)) { found = true; break; }
    Thread.sleep(1000);
}

// BAD: Fixed sleep
Thread.sleep(5000);  // NEVER do this
```

## Cross-Platform Testing Rules

1. Same test method names on both platforms
2. Different locators per platform in Screen classes
3. Use `ElementHandler.getElement(driver, android, ios)` pattern
4. Platform-specific flows in separate helper methods
5. Test data is the same across platforms
6. Verify both platforms produce identical business outcomes

## Common Mobile Test Failures

| Failure | Cause | Fix |
|---------|-------|-----|
| NoSuchElementException | Element not on screen yet | Add explicit wait |
| StaleElementReference | Screen transitioned | Re-locate element |
| TimeoutException | Element never appeared | Check if flow changed |
| WebDriverException: Session not created | Device/emulator not ready | Check DriverManager setup |
| Element not clickable | Overlapped by another element | Scroll to element, or use coordinate tap |

## Data-Driven Mobile Tests

```java
@DataProvider(name = "loginScenarios")
public Object[][] loginData() {
    return new Object[][] {
        {"valid@email.com", "Pass123!", true, "Dashboard"},
        {"invalid@email.com", "wrong", false, "Login"},
        {"", "Pass123!", false, "Login"},
        {"valid@email.com", "", false, "Login"},
    };
}
```

## Test Isolation for Mobile

- Each test class manages its own driver lifecycle
- Navigate to known state in @BeforeClass
- Clean up in @AfterClass (logout, clear data)
- Don't depend on other test classes' state
- Use unique test data per class where possible
