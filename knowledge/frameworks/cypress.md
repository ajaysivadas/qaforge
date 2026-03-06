# Cypress Framework Knowledge

## Test Structure

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="submit-button"]').should('be.enabled');
  });

  it('should login with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('user@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="submit-button"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should show error for invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrong');
    cy.get('[data-testid="submit-button"]').click();
    cy.get('[data-testid="error-message"]').should('contain', 'Invalid credentials');
  });
});
```

## Custom Commands Pattern

```javascript
// cypress/support/commands.js
Cypress.Commands.add('login', (email, password) => {
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="submit-button"]').click();
});

Cypress.Commands.add('loginByAPI', (email, password) => {
  cy.request('POST', '/api/auth/login', { email, password }).then((resp) => {
    window.localStorage.setItem('authToken', resp.body.token);
  });
});

// Usage in test
it('should access dashboard', () => {
  cy.loginByAPI('user@example.com', 'password123');
  cy.visit('/dashboard');
  cy.get('h1').should('contain', 'Dashboard');
});
```

## Page Object Pattern

```javascript
// cypress/pages/LoginPage.js
class LoginPage {
  get emailInput() { return cy.get('[data-testid="email-input"]'); }
  get passwordInput() { return cy.get('[data-testid="password-input"]'); }
  get submitButton() { return cy.get('[data-testid="submit-button"]'); }
  get errorMessage() { return cy.get('[data-testid="error-message"]'); }

  visit() {
    cy.visit('/login');
  }

  login(email, password) {
    this.emailInput.type(email);
    this.passwordInput.type(password);
    this.submitButton.click();
  }
}

export default new LoginPage();
```

## API Testing with Cypress

```javascript
describe('API Tests', () => {
  it('GET - list users', () => {
    cy.request('GET', '/api/users').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.be.an('array');
    });
  });

  it('POST - create user', () => {
    cy.request('POST', '/api/users', {
      name: 'Test User',
      email: 'test@example.com',
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
    });
  });

  it('handles 404 gracefully', () => {
    cy.request({ url: '/api/users/99999', failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});
```

## Network Interception

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

  it('should handle API error', () => {
    cy.intercept('GET', '/api/users', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('getUsersError');

    cy.visit('/users');
    cy.wait('@getUsersError');
    cy.get('[data-testid="error-state"]').should('be.visible');
  });

  it('should wait for slow API', () => {
    cy.intercept('GET', '/api/users', (req) => {
      req.reply({ delay: 2000, body: { data: [] } });
    }).as('slowRequest');

    cy.visit('/users');
    cy.get('[data-testid="loading"]').should('be.visible');
    cy.wait('@slowRequest');
    cy.get('[data-testid="loading"]').should('not.exist');
  });
});
```

## Configuration

```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    retries: { runMode: 2, openMode: 0 },
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
  },
});
```

## Selector Priority

1. `[data-testid="..."]` — most reliable, explicit
2. `[data-cy="..."]` — Cypress convention
3. `.class-name` or `#id` — CSS selectors
4. `:contains("text")` — text content
5. `xpath` — last resort (requires plugin)

## Key Rules

1. Never use `cy.wait(ms)` for timing — use `cy.intercept()` + `cy.wait('@alias')` instead
2. Cypress commands are asynchronous but NOT promises — don't mix with `async/await`
3. Use `cy.request()` for API setup/teardown to avoid UI overhead
4. Keep tests independent — use `beforeEach` for setup, not `before`
5. Assertions auto-retry — Cypress waits for elements, don't add manual waits
6. Use fixtures for test data: `cy.fixture('users.json')`

## Typical Project Structure

```
cypress/
├── e2e/                    # Test specs
│   ├── auth/
│   │   └── login.cy.js
│   ├── users/
│   │   └── crud.cy.js
│   └── api/
│       └── users-api.cy.js
├── fixtures/               # Test data
│   └── users.json
├── pages/                  # Page objects
│   └── LoginPage.js
├── support/
│   ├── commands.js         # Custom commands
│   └── e2e.js              # Support file
└── cypress.config.js
```
