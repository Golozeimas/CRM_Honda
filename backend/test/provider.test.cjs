const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ResendProvider } = require('../dist/offers/provider');
const { renderOffer } = require('../dist/offers/template');
const { createUnsubscribeToken, verifyUnsubscribeToken } = require('../dist/offers/unsubscribeToken');
const secret = 'test-only-secret-with-at-least-32-bytes';

test('provider passes immutable payload and idempotency key, requires acceptance ID', async () => {
  const message = { to: ['a@example.com'] };
  const provider = new ResendProvider('test-key', async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(options.headers['Idempotency-Key'], 'cycle');
    assert.deepEqual(JSON.parse(options.body), message);
    return new Response(JSON.stringify({ id: 'accepted-id' }), { status: 200 });
  });
  assert.equal(await provider.send(message, 'cycle'), 'accepted-id');
  for (const status of [400, 401, 409, 429, 500]) {
    const failed = new ResendProvider('test-key', async () => new Response('private data', { status }));
    await assert.rejects(failed.send(message, 'cycle'), { message: `provider_http_${status}` });
  }
  await assert.rejects(new ResendProvider('test-key', async () => { throw new Error('private data'); }).send(message, 'cycle'), { message: 'provider_network_or_timeout' });
  await assert.rejects(new ResendProvider('test-key', async () => new Response('{}')).send(message, 'cycle'), { message: 'provider_invalid_response' });
});
test('template escapes personal/commercial data and includes opt-out in both formats', () => {
  const message = renderOffer({ name: '<script>', modelDisplay: 'CG 160', unit: 'TIMON' }, 'a@example.com', 'sales@example.com', { subject: 'Oferta', body: '<b>Condições aprovadas</b>', url: 'https://example.com' }, 'https://example.com/unsubscribe?token=test');
  assert.ok(message.html.includes('&lt;script&gt;'));
  assert.ok(!message.html.includes('<b>'));
  assert.ok(message.text.includes('Timon - MA'));
  assert.ok(message.text.includes('token=test'));
  assert.equal(message.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click');
  assert.throws(() => renderOffer({}, 'a@example.com', 'sales@example.com', { subject: 'Oferta', body: 'body', url: 'javascript:alert(1)' }, 'https://example.com'));
});
test('unsubscribe requires authentic signature and is bound to lead and address', () => {
  const token = createUnsubscribeToken('lead1', 'a@example.com', secret);
  assert.deepEqual(verifyUnsubscribeToken(token, secret), { leadId: 'lead1', email: 'a@example.com' });
  assert.equal(verifyUnsubscribeToken('lead1', secret), null);
  assert.equal(verifyUnsubscribeToken(`x${token}`, secret), null);
  assert.equal(verifyUnsubscribeToken(token, `${secret}different`), null);
  assert.equal(verifyUnsubscribeToken(`${token}.extra`, secret), null);
  assert.throws(() => createUnsubscribeToken('lead1', 'a@example.com', 'short'));
});
