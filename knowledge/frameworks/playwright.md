# Playwright Framework Knowledge

## Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Feature Name', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should display login form', async ({ page }) => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeEnabled();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.login('user@example.com', 'password');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await loginPage.login('invalid@example.com', 'wrong');
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
  });
});
```

## Page Object Pattern

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByTestId('error-message');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

## API Testing with Playwright

```typescript
import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  test('GET endpoint returns correct data', async ({ request }) => {
    const response = await request.get('/api/users');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('POST creates resource', async ({ request }) => {
    const response = await request.post('/api/users', {
      data: { name: 'Test User', email: 'test@example.com' },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.id).toBeDefined();
  });

  test('DELETE removes resource', async ({ request }) => {
    const response = await request.delete('/api/users/1');
    expect(response.status()).toBe(204);
  });

  test('handles 404', async ({ request }) => {
    const response = await request.get('/api/users/99999');
    expect(response.status()).toBe(404);
  });
});
```

## Network Interception

```typescript
test('mock API response', async ({ page }) => {
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

test('modify real response', async ({ page }) => {
  await page.route('**/api/users', async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    json.data[0].name = 'Modified';
    route.fulfill({ response, body: JSON.stringify(json) });
  });

  await page.goto('/users');
  await expect(page.getByText('Modified')).toBeVisible();
});
```

## Visual Regression Testing

```typescript
test('homepage visual snapshot', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});

test('component visual snapshot', async ({ page }) => {
  await page.goto('/components');
  const card = page.getByTestId('user-card');
  await expect(card).toHaveScreenshot('user-card.png', {
    maxDiffPixelRatio: 0.01,
  });
});

// Update snapshots: npx playwright test --update-snapshots
```

## Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['allure-playwright'],
    ['junit', { outputFile: 'results.xml' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
});
```

## Locator Priority

1. `page.getByRole()` — best, semantic
2. `page.getByTestId()` — reliable, explicit
3. `page.getByText()` — user-visible text
4. `page.getByLabel()` — form fields
5. `page.locator('css')` — fallback
6. `page.locator('xpath')` — last resort

## Key Rules

1. Prefer `getByRole` locators — they're resilient to DOM changes
2. Never use `page.waitForTimeout()` — use `expect` auto-retrying assertions instead
3. Use `test.describe` for grouping, `test.beforeEach` for setup
4. API setup via `request` fixture is faster than UI setup
5. Run tests in parallel by default (`fullyParallel: true`)
6. Use `--trace on` for debugging — provides screenshots, DOM snapshots, network logs
7. Visual snapshots are OS-specific — generate per-platform in CI

## Typical Project Structure

```
tests/
├── e2e/
│   ├── auth/
│   │   └── login.spec.ts
│   ├── users/
│   │   └── crud.spec.ts
│   └── api/
│       └── users-api.spec.ts
├── pages/
│   ├── LoginPage.ts
│   └── DashboardPage.ts
├── fixtures/
│   └── test-data.ts
├── playwright.config.ts
└── global-setup.ts
```
