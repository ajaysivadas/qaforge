# WebSocket & Real-Time Testing Patterns

## Connection Lifecycle Testing

```javascript
const WebSocket = require('ws');

describe('WebSocket Connection', () => {
  let ws;

  afterEach(() => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.close();
  });

  it('should connect successfully', (done) => {
    ws = new WebSocket('ws://localhost:3000/ws');
    ws.on('open', () => {
      expect(ws.readyState).toBe(WebSocket.OPEN);
      done();
    });
    ws.on('error', done);
  });

  it('should reject unauthorized connections', (done) => {
    ws = new WebSocket('ws://localhost:3000/ws');
    ws.on('close', (code) => {
      expect(code).toBe(4001); // Custom unauthorized code
      done();
    });
  });

  it('should handle server disconnect gracefully', (done) => {
    ws = new WebSocket('ws://localhost:3000/ws', {
      headers: { Authorization: 'Bearer valid-token' },
    });
    ws.on('open', () => {
      // Server sends close
      ws.on('close', (code, reason) => {
        expect(code).toBe(1000);
        done();
      });
    });
  });
});
```

## Message Send/Receive Testing

```javascript
function waitForMessage(ws, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout waiting for message')), timeout);
    ws.once('message', (data) => {
      clearTimeout(timer);
      resolve(JSON.parse(data.toString()));
    });
  });
}

describe('WebSocket Messaging', () => {
  let ws;

  beforeEach((done) => {
    ws = new WebSocket('ws://localhost:3000/ws', {
      headers: { Authorization: 'Bearer valid-token' },
    });
    ws.on('open', done);
  });

  afterEach(() => ws.close());

  it('should echo messages back', async () => {
    ws.send(JSON.stringify({ type: 'ping', data: 'hello' }));
    const response = await waitForMessage(ws);
    expect(response.type).toBe('pong');
    expect(response.data).toBe('hello');
  });

  it('should broadcast to subscribers', async () => {
    // Subscribe to a channel
    ws.send(JSON.stringify({ type: 'subscribe', channel: 'updates' }));
    const ack = await waitForMessage(ws);
    expect(ack.type).toBe('subscribed');

    // Trigger an event (via API or another WS client)
    const msg = await waitForMessage(ws, 10000);
    expect(msg.type).toBe('update');
    expect(msg.channel).toBe('updates');
  });

  it('should handle invalid message format', async () => {
    ws.send('not valid json');
    const response = await waitForMessage(ws);
    expect(response.type).toBe('error');
    expect(response.message).toContain('Invalid');
  });
});
```

## Python WebSocket Testing

```python
import asyncio
import websockets
import json
import pytest

@pytest.fixture
async def ws_connection():
    """Create authenticated WebSocket connection."""
    async with websockets.connect(
        "ws://localhost:3000/ws",
        extra_headers={"Authorization": "Bearer valid-token"},
    ) as ws:
        yield ws

@pytest.mark.asyncio
async def test_send_receive(ws_connection):
    await ws_connection.send(json.dumps({"type": "ping"}))
    response = json.loads(await asyncio.wait_for(ws_connection.recv(), timeout=5))
    assert response["type"] == "pong"

@pytest.mark.asyncio
async def test_subscription():
    async with websockets.connect("ws://localhost:3000/ws") as ws:
        await ws.send(json.dumps({"type": "subscribe", "channel": "updates"}))
        ack = json.loads(await asyncio.wait_for(ws.recv(), timeout=5))
        assert ack["type"] == "subscribed"

@pytest.mark.asyncio
async def test_connection_rejected_without_auth():
    with pytest.raises(websockets.exceptions.ConnectionClosedError):
        async with websockets.connect("ws://localhost:3000/ws") as ws:
            await ws.recv()
```

## Playwright WebSocket Testing

```typescript
import { test, expect } from '@playwright/test';

test('should receive real-time updates', async ({ page }) => {
  const wsMessages: string[] = [];

  // Listen for WebSocket frames
  page.on('websocket', (ws) => {
    ws.on('framereceived', (frame) => {
      wsMessages.push(frame.payload as string);
    });
  });

  await page.goto('/dashboard');

  // Wait for at least one WS message
  await page.waitForTimeout(2000);
  expect(wsMessages.length).toBeGreaterThan(0);

  const parsed = JSON.parse(wsMessages[0]);
  expect(parsed).toHaveProperty('type');
});
```

## Test Validation Matrix

| Scenario | Expected | Priority |
|----------|----------|----------|
| Connect with valid auth | Connection open | P0 |
| Connect without auth | Connection rejected (4001) | P0 |
| Send valid message | Correct response | P0 |
| Send malformed message | Error response | P1 |
| Subscribe to channel | Ack + receive updates | P0 |
| Unsubscribe from channel | Stop receiving updates | P1 |
| Server-initiated disconnect | Clean close (1000) | P1 |
| Reconnect after disconnect | Successful reconnection | P1 |
| Message ordering | Messages arrive in order | P2 |
| Concurrent connections | Independent message streams | P2 |
| Connection timeout/heartbeat | Keep-alive works | P2 |
| Large payload | Handled or rejected gracefully | P2 |

## Key Rules

1. Always set timeouts on `recv()`/`waitForMessage()` — never wait indefinitely
2. Clean up connections in `afterEach`/teardown to avoid test leaks
3. Test both the happy path (connect, subscribe, receive) and error paths (auth failure, malformed messages)
4. Use a helper function for `waitForMessage` to avoid boilerplate
5. For broadcast testing, use multiple WS clients to verify fan-out
6. Test reconnection logic if the client implements it
7. Verify message ordering when it matters to the protocol
