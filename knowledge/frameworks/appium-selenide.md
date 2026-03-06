# Appium + Selenide Framework Knowledge

## Screen (Page Object) Pattern

```java
package com.yourorg.Screens.FeatureName;

import com.yourorg.Base.MobileActions;
import com.yourorg.Utils.ElementHandler;
import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.WebElement;

public class FeatureScreen extends MobileActions {

    private AppiumDriver driver;

    // Cross-platform element using ElementHandler
    private WebElement elementName() {
        return ElementHandler.getElement(driver,
            "android_locator",   // Android: accessibility ID, XPath, or className
            "ios_locator"        // iOS: accessibility ID, XPath, or className
        );
    }

    // Universal element (same locator on both platforms)
    private WebElement universalElement() {
        return ElementHandler.getElement(driver, "shared_accessibility_id");
    }

    public FeatureScreen(AppiumDriver driver) {
        this.driver = driver;
    }

    // Action methods — verb-based naming
    public void clickSubmitButton() {
        click(elementName());
    }

    public void enterUsername(String text) {
        inputText(elementName(), text);
    }

    // Verification methods
    public boolean isScreenDisplayed() {
        return isElementDisplayed(elementName());
    }

    public String getDisplayedValue() {
        return elementName().getText();
    }
}
```

## Key Rules

1. **Screen classes extend MobileActions** (provides click, inputText, tap, swipe, scroll)
2. **Elements are private methods**, not fields — called fresh each time to avoid staleness
3. **ElementHandler.getElement()** auto-detects locator type:
   - Starts with `//` or `(//` -> XPath
   - Starts with `android.` or `XCUIElementType` -> Class Name
   - Everything else -> Accessibility ID
4. **Two-arg getElement** for platform-specific locators, **one-arg** for universal
5. **Class names end with `Screen`**, test classes end with `Test`
6. **Constructor takes AppiumDriver** — injected from test class

## Test Class Pattern

```java
@Epic("Feature Epic")
@Feature("Feature Name")
public class FeatureNameTest {

    protected static AppiumDriver driver;
    private static FeatureScreen featureScreen;
    private static AnotherScreen anotherScreen;

    @BeforeClass
    public void setUp() {
        DriverManager.initializeDriver();
        driver = DriverManager.getDriver();
        featureScreen = new FeatureScreen(driver);
        anotherScreen = new AnotherScreen(driver);
    }

    @Test(priority = 1)
    @Severity(SeverityLevel.BLOCKER)
    @Story("Screen visibility")
    @Description("Verify the feature screen is displayed")
    public void Verify_Feature_Screen_Is_Displayed() {
        Assertions.assertTrue(featureScreen.isScreenDisplayed(),
            "Feature screen should be visible");
    }

    @Test(priority = 2)
    @Severity(SeverityLevel.CRITICAL)
    @Story("User action")
    @Description("Verify user can submit the form")
    public void Verify_User_Can_Submit_Form() {
        featureScreen.enterUsername("testuser");
        featureScreen.clickSubmitButton();
        Assertions.assertTrue(anotherScreen.isScreenDisplayed(),
            "Should navigate to next screen");
    }

    @AfterClass
    public void tearDown() {
        DriverManager.quitDriver();
    }
}
```

## Driver Management

- **DriverManager**: ThreadLocal AppiumDriver per thread
- `DriverManager.initializeDriver()` — auto-detects platform, creates driver
- `DriverManager.getDriver()` — returns current thread's driver
- `DriverManager.quitDriver()` — cleanup
- NEVER create drivers directly, always use DriverManager

## Mobile Interactions (MobileActions)

- `click(element)` — tap element
- `inputText(element, text)` — type text
- `tap(x, y)` — coordinate tap
- `longPress(element)` — long press
- `swipe(Direction.UP/DOWN/LEFT/RIGHT)` — swipe gesture
- `scroll(Direction.UP/DOWN)` — scroll gesture
- `isElementDisplayed(element)` — visibility check

## Cross-Platform Strategy

- Use accessibility IDs as primary locators (work on both platforms)
- Fall back to XPath only when accessibility ID isn't available
- Use `ElementHandler.getElement(driver, androidLocator, iosLocator)` for platform differences
- Test method names are the same across platforms — only locators differ

## Typical Package Structure

```
src/main/java/com/yourorg/
├── Base/
│   ├── DriverManager.java         # ThreadLocal driver management
│   ├── AppiumServer.java          # Server lifecycle
│   ├── DesiredCaps.java           # Capability configuration
│   ├── MobileActions.java         # Click, type, swipe, scroll
│   ├── MobileVerifications.java   # Element verification helpers
│   └── NativeActions.java         # Platform-native actions
├── Screens/<Feature>/             # Page objects organized by feature
├── Assertions/                    # Custom assertions with Allure + screenshots
├── Listener/                      # TestNG listeners
└── Utils/
    ├── ElementHandler.java        # Cross-platform element locator
    ├── AllureManager.java         # Allure utilities
    └── SecretsHandler.java        # Config/secrets access

src/test/java/com/yourorg/
└── <Feature>/                     # Test classes organized by feature
```

## Common Locator Patterns

```java
// Accessibility ID (preferred — cross-platform)
ElementHandler.getElement(driver, "login_button")

// Platform-specific accessibility IDs
ElementHandler.getElement(driver, "android_login_btn", "ios_login_btn")

// XPath (when accessibility ID unavailable)
ElementHandler.getElement(driver,
    "//android.widget.Button[@text='Login']",
    "//XCUIElementTypeButton[@name='Login']")

// Class name
ElementHandler.getElement(driver,
    "android.widget.EditText",
    "XCUIElementTypeTextField")
```
