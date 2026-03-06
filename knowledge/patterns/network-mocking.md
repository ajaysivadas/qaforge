# Network Mocking & Interception Patterns

## Playwright — Route Interception

```typescript
import { test, expect } from '@playwright/test';

test('mock API response', async ({ page }) => {
  // Intercept and return mock data
  await page.route('**/api/users', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [{ id: 1, name: 'Mock User' }] }),
    });
  });

  await page.goto('/users');
  await expect(page.getByText('Mock User')).toBeVisible();
});

test('simulate server error', async ({ page }) => {
  await page.route('**/api/users', (route) => {
    route.fulfill({ status: 500, body: 'Internal Server Error' });
  });

  await page.goto('/users');
  await expect(page.getByTestId('error-state')).toBeVisible();
});

test('simulate network failure', async ({ page }) => {
  await page.route('**/api/users', (route) => route.abort('connectionrefused'));
  await page.goto('/users');
  await expect(page.getByTestId('offline-message')).toBeVisible();
});

test('delay response', async ({ page }) => {
  await page.route('**/api/users', async (route) => {
    await new Promise((r) => setTimeout(r, 3000));
    route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) });
  });

  await page.goto('/users');
  await expect(page.getByTestId('loading-spinner')).toBeVisible();
});

test('modify real response', async ({ page }) => {
  await page.route('**/api/users', async (route) => {
    const response = await route.fetch(); // Let request go through
    const json = await response.json();
    json.data[0].name = 'Modified Name';
    route.fulfill({ response, body: JSON.stringify(json) });
  });

  await page.goto('/users');
  await expect(page.getByText('Modified Name')).toBeVisible();
});
```

## Cypress — cy.intercept

```javascript
describe('With mocked API', () => {
  it('should display mocked data', () => {
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: { data: [{ id: 1, name: 'Mock User' }] },
    }).as('getUsers');

    cy.visit('/users');
    cy.wait('@getUsers');
    cy.get('[data-testid="user-name"]').should('contain', 'Mock User');
  });

  it('should handle error state', () => {
    cy.intercept('GET', '/api/users', { statusCode: 500 }).as('getUsers');
    cy.visit('/users');
    cy.wait('@getUsers');
    cy.get('[data-testid="error-state"]').should('be.visible');
  });

  it('should modify response on the fly', () => {
    cy.intercept('GET', '/api/users', (req) => {
      req.continue((res) => {
        res.body.data[0].name = 'Modified';
      });
    }).as('getUsers');

    cy.visit('/users');
    cy.wait('@getUsers');
  });

  it('should assert on request body', () => {
    cy.intercept('POST', '/api/users', (req) => {
      expect(req.body).to.have.property('name');
      expect(req.body).to.have.property('email');
      req.reply({ statusCode: 201, body: { id: 99 } });
    }).as('createUser');

    cy.visit('/users/new');
    cy.get('[data-testid="name"]').type('Test');
    cy.get('[data-testid="email"]').type('test@example.com');
    cy.get('[data-testid="submit"]').click();
    cy.wait('@createUser');
  });
});
```

## RestAssured — WireMock Integration (Java)

```java
import com.github.tomakehurst.wiremock.WireMockServer;
import static com.github.tomakehurst.wiremock.client.WireMock.*;

public class ExternalServiceMockTest {
    private static WireMockServer wireMock;

    @BeforeClass
    public static void setup() {
        wireMock = new WireMockServer(8089);
        wireMock.start();
    }

    @AfterClass
    public static void teardown() {
        wireMock.stop();
    }

    @BeforeMethod
    public void resetMocks() {
        wireMock.resetAll();
    }

    @Test
    public void testWithMockedDependency() {
        // Stub external service
        wireMock.stubFor(get(urlEqualTo("/external/api/data"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody("{\"result\": \"mocked\"}")));

        // Test your API that calls the external service
        given()
            .baseUri("http://localhost:8080")
        .when()
            .get("/api/aggregated-data")
        .then()
            .statusCode(200)
            .body("externalData.result", equalTo("mocked"));

        // Verify the external call was made
        wireMock.verify(getRequestedFor(urlEqualTo("/external/api/data")));
    }

    @Test
    public void testExternalServiceTimeout() {
        wireMock.stubFor(get(urlEqualTo("/external/api/data"))
            .willReturn(aResponse()
                .withFixedDelay(5000) // 5 second delay
                .withStatus(200)));

        given()
            .baseUri("http://localhost:8080")
        .when()
            .get("/api/aggregated-data")
        .then()
            .statusCode(504); // Gateway timeout
    }
}
```

## pytest — responses / httpx mock

```python
import responses
import requests

@responses.activate
def test_external_api_call():
    """Mock external HTTP call with responses library."""
    responses.add(
        responses.GET,
        "https://api.external.com/data",
        json={"result": "mocked"},
        status=200,
    )

    # Your code that calls the external API
    result = fetch_external_data()
    assert result["result"] == "mocked"
    assert len(responses.calls) == 1

@responses.activate
def test_external_api_failure():
    """Mock external API returning error."""
    responses.add(
        responses.GET,
        "https://api.external.com/data",
        json={"error": "Service unavailable"},
        status=503,
    )

    with pytest.raises(ExternalServiceError):
        fetch_external_data()
```

```python
# httpx mock alternative
import pytest
from pytest_httpx import HTTPXMock

def test_with_httpx_mock(httpx_mock: HTTPXMock):
    httpx_mock.add_response(
        url="https://api.external.com/data",
        json={"result": "mocked"},
    )
    result = fetch_external_data()
    assert result["result"] == "mocked"
```

## When to Mock vs When to Hit Real APIs

| Scenario | Approach | Why |
|----------|----------|-----|
| Unit tests for business logic | Mock external calls | Speed, isolation |
| Integration tests for your API | Mock external dependencies only | Test your code path |
| E2E tests for UI flows | Mock slow/flaky APIs | Stability |
| Contract tests | Mock with schemas | Verify interface |
| Smoke tests in staging | Real calls | Verify connectivity |
| Load/performance tests | Real calls | Accurate metrics |

## Key Rules

1. Mock at the boundary — mock external services, not your own code
2. Use realistic mock data — match production response shapes
3. Always clean up mocks between tests (`resetAll`, `afterEach`)
4. Verify mocked endpoints were actually called (catch dead code)
5. Test both success and failure modes of mocked services
6. For flaky external APIs, mock in CI but test real in nightly runs
7. Keep mock data in fixtures/files, not inline in tests
