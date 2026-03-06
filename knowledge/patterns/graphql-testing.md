# GraphQL API Testing Patterns

## Query Testing

### Basic Query Validation

```javascript
// Jest + Supertest
describe('GraphQL Queries', () => {
  it('should fetch user by ID', async () => {
    const query = `
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          name
          email
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .send({ query, variables: { id: '1' } })
      .expect(200);

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.user).toHaveProperty('id', '1');
    expect(res.body.data.user).toHaveProperty('email');
  });

  it('should return null for non-existent user', async () => {
    const query = `query { user(id: "99999") { id name } }`;

    const res = await request(app)
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(res.body.data.user).toBeNull();
  });
});
```

### Python (pytest + requests)

```python
import requests

BASE_URL = "http://localhost:4000/graphql"

def graphql_request(query, variables=None):
    """Helper to send GraphQL requests."""
    payload = {"query": query}
    if variables:
        payload["variables"] = variables
    response = requests.post(BASE_URL, json=payload)
    return response.json()

def test_fetch_users():
    result = graphql_request("{ users { id name email } }")
    assert "errors" not in result
    assert len(result["data"]["users"]) > 0

def test_fetch_user_by_id():
    result = graphql_request(
        "query($id: ID!) { user(id: $id) { id name } }",
        variables={"id": "1"}
    )
    assert result["data"]["user"]["id"] == "1"
```

## Mutation Testing

```javascript
describe('GraphQL Mutations', () => {
  it('should create a user', async () => {
    const mutation = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          name
          email
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .send({
        query: mutation,
        variables: {
          input: { name: 'Test User', email: 'test@example.com' },
        },
      })
      .expect(200);

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.createUser.id).toBeDefined();
    expect(res.body.data.createUser.name).toBe('Test User');
  });

  it('should validate required fields', async () => {
    const mutation = `
      mutation { createUser(input: { name: "" }) { id } }
    `;

    const res = await request(app)
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toContain('validation');
  });
});
```

## Error Response Testing

```javascript
describe('GraphQL Error Handling', () => {
  it('should return error for invalid query syntax', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: '{ invalid syntax !!!' })
      .expect(400);

    expect(res.body.errors).toBeDefined();
  });

  it('should return error for unauthorized access', async () => {
    const query = `{ adminUsers { id email } }`;

    const res = await request(app)
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
  });

  it('should handle partial errors', async () => {
    const query = `{
      publicUser: user(id: "1") { id name }
      restrictedUser: user(id: "2") { id email sensitiveField }
    }`;

    const res = await request(app)
      .post('/graphql')
      .send({ query })
      .expect(200);

    // Data may be partially returned with errors
    expect(res.body.data.publicUser).toBeDefined();
    expect(res.body.errors).toBeDefined();
  });
});
```

## Test Validation Matrix

| Scenario | Expected | Priority |
|----------|----------|----------|
| Valid query returns correct fields | 200 + data | P0 |
| Query with variables resolves correctly | 200 + data | P0 |
| Mutation creates/updates/deletes | 200 + data | P0 |
| Invalid query syntax | 400 + errors | P0 |
| Missing required variables | 200 + errors | P1 |
| Unauthorized query | 200 + UNAUTHENTICATED | P1 |
| N+1 query detection (nested resolvers) | Acceptable query count | P1 |
| Query depth limit exceeded | 200 + errors | P2 |
| Query complexity limit exceeded | 200 + errors | P2 |
| Pagination (first/after, limit/offset) | Correct page data | P1 |
| Subscription connection | WebSocket open + data | P2 |
| Batch queries (multiple ops in one request) | All resolved | P2 |

## Pagination Testing

```javascript
it('should paginate with cursor-based pagination', async () => {
  const query = `
    query($first: Int!, $after: String) {
      users(first: $first, after: $after) {
        edges { node { id name } cursor }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;

  // First page
  const page1 = await graphqlRequest(query, { first: 2 });
  expect(page1.data.users.edges).toHaveLength(2);
  expect(page1.data.users.pageInfo.hasNextPage).toBe(true);

  // Second page
  const cursor = page1.data.users.pageInfo.endCursor;
  const page2 = await graphqlRequest(query, { first: 2, after: cursor });
  expect(page2.data.users.edges).toHaveLength(2);

  // No overlap
  const page1Ids = page1.data.users.edges.map(e => e.node.id);
  const page2Ids = page2.data.users.edges.map(e => e.node.id);
  expect(page1Ids).not.toEqual(expect.arrayContaining(page2Ids));
});
```

## Key Rules

1. Always check `errors` is undefined for successful queries
2. GraphQL returns 200 even for application errors — check `errors` array, not HTTP status
3. Test both `data` and `errors` fields in every response
4. Validate returned field types match the schema
5. Test query depth/complexity limits if the server enforces them
6. For mutations, verify side effects (DB state, events emitted) not just the response
7. Test with both authenticated and unauthenticated requests
