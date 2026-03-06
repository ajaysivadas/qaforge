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

1. Read `~/.claude/qaforge-knowledge/INDEX.md` to determine which files to load
2. Read `~/.claude/qaforge-knowledge/frameworks/appium-selenide.md` and `patterns/mobile-testing.md`
3. Read `~/.claude/qaforge-knowledge/standards/test-naming.md`
4. Read project `CLAUDE.md` if it exists

## Instructions

### Step 1: Understand the Flow

Analyze the input for: screens involved, actions per screen, transitions, assertions needed.

If a screenshot path is provided, use the Read tool to view it — Claude Code can read images and identify UI elements, labels, buttons, and layout from screenshots.

If the input is unclear (e.g., just a screen name with no flow details), ask: "Can you describe the user flow step by step, or provide a screenshot of the screen?"

### Step 2: Read Existing Framework Code

Scan the current project for existing patterns using concrete searches:
1. `Glob("**/screens/*.java")` or `Glob("**/pages/*.java")` — find existing screen/page object classes and match the pattern exactly
2. `Grep("ElementHandler", "src/")` or `Grep("element(", "src/")` — find element handler or locator utility to understand the locator approach
3. `Glob("**/base/*Action*.java")` — find base action class for available interaction methods
4. `Glob("**/test/**/*Test.java")` — find existing test classes and match structure

If no existing patterns are found, use the knowledge base patterns as the template.

### Step 3: Cross-Platform Considerations

**Do this BEFORE code generation** to inform the generated code.

Flag elements needing platform-specific handling:
- Date pickers, native dialogs, keyboard interactions
- Different gesture behaviors (swipe, scroll, long press)
- Platform-specific navigation (back button, tab bar)
- Status bar, permissions dialogs, notification handling

For each flagged element, note the platform-specific approach that the generated code should use.

### Step 4: Confirm Scope (Checkpoint)

Present to the user before generating:
- Screens to generate: <list>
- Platform(s): Android / iOS / Both
- Cross-platform flags: <count> elements needing platform handling
- Files to create: <list of file names>

Ask: "Proceed with generation?"

### Step 5: Generate Code

Follow the **exact patterns** from the knowledge base:

1. **Screen Class** — extends base actions, uses element handler, private element methods (not fields)
2. **Test Class** — driver lifecycle, screen objects as static variables, priority-ordered tests
3. **TestNG Suite XML** — with listener
4. **Maven Profile** — pointing to suite XML

Key rules:
- Elements are methods, not fields (avoids staleness)
- Use element handler for cross-platform locators
- Screen class has action methods (verb-based) and verification methods
- Test class: @BeforeClass inits driver + screens, @AfterClass quits
- Test methods use custom Assertions class with Allure integration
- Apply cross-platform flags from Step 3 (use platform conditionals where noted)

### Step 6: Present and Confirm

List all files created. Report results with a summary:
| File | Type | Lines |
|------|------|-------|
| <path> | Screen Class / Test Class / Suite XML | <count> |
