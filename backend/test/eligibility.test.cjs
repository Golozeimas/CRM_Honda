const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalizeEmail, isValidEmail, emailForPersistence } = require('../dist/domain/email');
const { isEligibleForOffers, OFFER_INTERVAL_MS } = require('../dist/offers/eligibility');

test('email normalization and validation shared with both forms and services', () => {
  assert.equal(normalizeEmail('  Cliente@Example.COM  '), 'cliente@example.com');
  assert.equal(emailForPersistence(' Cliente@Example.COM '), 'cliente@example.com');
  for (const value of ['', ' ', 'abc', 'a@b', 'a@@b.com', 'a b@c.com', 'a@b..com']) {
    assert.equal(isValidEmail(value), false, value);
    assert.throws(() => emailForPersistence(value));
  }
  assert.equal(emailForPersistence('', false), '');
  assert.equal(isValidEmail('user+tag@example.com.br'), true);
});

const lead = { email: 'a@example.com', subscribedToOffers: true, status: 'NOVO' };
test('only explicit opt-in and commercial statuses are eligible; legacy is opt-out', () => {
  assert.equal(isEligibleForOffers(lead, Date.now()), true);
  for (const change of [{ email: undefined }, { email: '' }, { email: 'bad' }, { subscribedToOffers: undefined }, { subscribedToOffers: false }, { status: 'CONVERTIDO' }, { status: 'PERDIDO' }, { status: 'unknown' }]) {
    assert.equal(isEligibleForOffers({ ...lead, ...change }, Date.now()), false);
  }
  assert.equal(isEligibleForOffers({ ...lead, status: 'EM_CONTATO' }, Date.now()), true);
});
test('per-lead interval includes exact 30-day boundary, future and malformed history', () => {
  const now = Date.now();
  for (const elapsed of [0, OFFER_INTERVAL_MS - 1, -1000]) {
    assert.equal(isEligibleForOffers({ ...lead, lastOfferSentAt: { toMillis: () => now - elapsed } }, now), false);
  }
  assert.equal(isEligibleForOffers({ ...lead, lastOfferSentAt: { toMillis: () => now - OFFER_INTERVAL_MS } }, now), true);
  assert.equal(isEligibleForOffers({ ...lead, lastOfferSentAt: 'invalid' }, now), false);
});
