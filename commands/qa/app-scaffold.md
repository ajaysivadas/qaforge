---
name: qa:app-scaffold
description: Generate mobile app test scaffolding with page objects and UI test flows for Appium/Selenide. Creates screen classes, test classes, and TestNG suite XML.
---

# QA App Test Scaffolding

Generate mobile app automation code from screen descriptions or user flows.

## Input

$ARGUMENTS

If no argument is provided, ask the user for:
- Screen/feature name
- User flow description (step by step)
- Platform (Android, iOS, or both)
- Element details (if available)

## Knowledge Base

**MUST READ** before generating code:
- `~/.claude/qa-pilot-knowledge/frameworks/appium-selenide.md` — screen pattern, element handler, test structure
- `~/.claude/qa-pilot-knowledge/patterns/mobile-testing.md` — verification checklist, locator strategy, wait patterns
- `~/.claude/qa-pilot-knowledge/standards/test-naming.md` — naming conventions

Also read project CLAUDE.md if it exists.

## Instructions

### Step 1: Understand the Flow

Analyze the input for: screens involved, actions per screen, transitions, assertions needed.

If a screenshot path is provided, read it to identify UI elements.

### Step 2: Read Existing Framework Code

Read these files to match existing patterns:
1. One existing `src/main/java/MarketFeed/Screens/<Feature>/` — match screen pattern exactly
2. `src/main/java/MarketFeed/Utils/ElementHandler.java` — understand locator approach
3. `src/main/java/MarketFeed/Base/MobileActions.java` — available interaction methods
4. One existing test class — match structure

### Step 3: Generate Code

Follow the **exact patterns** from the knowledge base:

1. **Screen Class** — extends MobileActions, uses ElementHandler, private element methods (not fields)
2. **Test Class** — DriverManager lifecycle, screen objects as static variables, priority-ordered tests
3. **TestNG Suite XML** — with listener
4. **Maven Profile** — pointing to suite XML

Key rules:
- Elements are methods, not fields (avoids staleness)
- Use `ElementHandler.getElement(driver, android, ios)` for cross-platform
- Screen class has action methods (verb-based) and verification methods
- Test class: @BeforeClass inits driver + screens, @AfterClass quits
- Test methods use Assertions class with Allure integration

### Step 4: Cross-Platform Considerations

Flag elements needing platform-specific handling:
- Date pickers, native dialogs, keyboard interactions
- Different gesture behaviors
- Platform-specific navigation

### Step 5: Present and Confirm

List all files. Ask for confirmation. Create files. Report results.
