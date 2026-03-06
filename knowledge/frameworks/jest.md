# Jest Framework Knowledge

## Test Structure

```javascript
const { UserService } = require('../services/UserService');

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getUser', () => {
    it('should return user by ID', async () => {
      const user = await userService.getUser(1);
      expect(user).toHaveProperty('id', 1);
      expect(user).toHaveProperty('email');
    });

    it('should throw for non-existent user', async () => {
      await expect(userService.getUser(99999)).rejects.toThrow('User not found');
    });
  });

  describe('createUser', () => {
    it('should create and return new user', async () => {
      const user = await userService.createUser({
        name: 'Test User',
        email: 'test@example.com',
      });
      expect(user.id).toBeDefined();
      expect(user.name).toBe('Test User');
    });
  });
});
```

## Mocking Patterns

```javascript
// Mock a module
jest.mock('../services/EmailService');

// Mock specific implementation
const { EmailService } = require('../services/EmailService');
EmailService.prototype.sendEmail = jest.fn().mockResolvedValue({ sent: true });

// Mock with factory
jest.mock('../utils/database', () => ({
  query: jest.fn(),
  connect: jest.fn().mockResolvedValue(true),
}));

// Spy on existing method
const spy = jest.spyOn(userService, 'validate');
await userService.createUser(data);
expect(spy).toHaveBeenCalledWith(data);
expect(spy).toHaveBeenCalledTimes(1);
```

### Manual Mock

```javascript
// __mocks__/axios.js
module.exports = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  create: jest.fn(function () { return this; }),
};
```

## API Testing with Supertest

```javascript
const request = require('supertest');
const app = require('../app');

describe('Users API', () => {
  it('GET /api/users returns list', async () => {
    const res = await request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('POST /api/users creates user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Test', email: 'test@example.com' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
  });

  it('GET /api/users/:id returns 404 for missing user', async () => {
    await request(app)
      .get('/api/users/99999')
      .expect(404);
  });

  it('POST /api/users validates required fields', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({})
      .expect(400);

    expect(res.body.errors).toBeDefined();
  });
});
```

## Data-Driven Tests

```javascript
describe.each([
  { input: 'user@example.com', valid: true },
  { input: 'invalid-email', valid: false },
  { input: '', valid: false },
  { input: 'a@b.c', valid: true },
  { input: 'user@.com', valid: false },
])('validateEmail($input)', ({ input, valid }) => {
  it(`should return ${valid}`, () => {
    expect(validateEmail(input)).toBe(valid);
  });
});

// Table-driven with test.each
test.each`
  a     | b     | expected
  ${1}  | ${2}  | ${3}
  ${-1} | ${1}  | ${0}
  ${0}  | ${0}  | ${0}
`('add($a, $b) = $expected', ({ a, b, expected }) => {
  expect(add(a, b)).toBe(expected);
});
```

## Snapshot Testing

```javascript
it('should match user response snapshot', async () => {
  const user = await userService.getUser(1);
  expect(user).toMatchSnapshot();
});

// Inline snapshot
it('should format user display name', () => {
  const display = formatDisplayName({ first: 'John', last: 'Doe' });
  expect(display).toMatchInlineSnapshot(`"John Doe"`);
});
```

## Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js', '**/*.spec.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
  setupFilesAfterSetup: ['./jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 10000,
};
```

## Key Rules

1. Each `describe` block groups related tests — nest for sub-features
2. Use `beforeEach` (not `before`) for test isolation
3. Always `restoreAllMocks()` in `afterEach` to prevent mock leakage
4. Prefer `toHaveBeenCalledWith()` over `toHaveBeenCalled()` for precision
5. Use `async/await` with `expect().rejects` for error testing
6. Keep snapshots small — snapshot large objects selectively
7. Use `jest.useFakeTimers()` for time-dependent tests

## Common Matchers

```javascript
// Equality
expect(value).toBe(42);              // strict equality
expect(obj).toEqual({ id: 1 });      // deep equality
expect(arr).toContain('item');        // array contains
expect(obj).toHaveProperty('key');    // has property

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(0.1 + 0.2).toBeCloseTo(0.3);

// Strings
expect(str).toMatch(/pattern/);
expect(str).toContain('substring');

// Errors
expect(() => fn()).toThrow('message');
await expect(asyncFn()).rejects.toThrow();
```

## Typical Project Structure

```
project/
├── src/
│   ├── services/
│   │   └── UserService.js
│   ├── utils/
│   │   └── validation.js
│   └── app.js
├── __tests__/
│   ├── services/
│   │   └── UserService.test.js
│   ├── api/
│   │   └── users.test.js
│   └── utils/
│       └── validation.test.js
├── __mocks__/
│   └── axios.js
├── jest.config.js
└── jest.setup.js
```
