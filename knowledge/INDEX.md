# QA Forge Knowledge Index

Read ONLY the files relevant to the detected project. Do NOT read all files.

## Framework Detection → Knowledge File

| Detected | Read this framework file |
|----------|------------------------|
| pom.xml + testng | `frameworks/testng-restassured.md` |
| pom.xml + appium/selenide | `frameworks/appium-selenide.md` |
| requirements.txt / pytest.ini / pyproject.toml | `frameworks/pytest.md` |
| package.json + playwright | `frameworks/playwright.md` |
| package.json + jest | `frameworks/jest.md` |
| package.json + cypress | `frameworks/cypress.md` |

## Feature Detection → Pattern File

| If the task involves | Read |
|---------------------|------|
| REST API endpoints | `patterns/api-testing.md` |
| GraphQL queries/mutations | `patterns/graphql-testing.md` |
| Mobile app screens/flows | `patterns/mobile-testing.md` |
| WebSocket/real-time | `patterns/websocket-testing.md` |
| Data pipelines/validation | `patterns/data-validation.md` |
| Flaky/intermittent failures | `patterns/flaky-test-patterns.md` |
| Mocking external services | `patterns/network-mocking.md` |

## Standards (read as needed)

| File | When to read |
|------|-------------|
| `standards/test-naming.md` | Generating code (scaffold commands) |
| `standards/test-structure.md` | Generating code or analyzing structure |
| `standards/coverage-criteria.md` | Planning, coverage analysis, or regression |

All paths relative to `~/.claude/qaforge-knowledge/`.
