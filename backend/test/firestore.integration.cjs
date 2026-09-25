const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { doc, setDoc, updateDoc, getDoc, serverTimestamp } = require('firebase/firestore');
const { initializeApp, deleteApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { OfferProcessor, LEASE_MS, RETRY_WINDOW_MS } = require('../dist/offers/processor');
const { runOfferBatch } = require('../dist/offers/scheduler');
const { OFFER_INTERVAL_MS } = require('../dist/offers/eligibility');
const { unsubscribeHandler } = require('../dist/offers/unsubscribe');
const { createUnsubscribeToken } = require('../dist/offers/unsubscribeToken');

if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error('Run only through Firebase emulators:exec');
const projectId = 'demo-crm-offers';
let env, app, db;
before(async () => {
  env = await initializeTestEnvironment({ projectId, firestore: { rules: fs.readFileSync(path.join(__dirname, '../../frontend/firestore.rules'), 'utf8') } });
  app = initializeApp({ projectId }, 'offers-tests');
  db = getFirestore(app);
});
beforeEach(async () => { await env.clearFirestore(); });
after(async () => { await env?.cleanup(); await deleteApp(app); });

const eligible = { name: 'Cliente', email: 'client@example.com', status: 'NOVO', subscribedToOffers: true, offersSentCount: 0 };
const message = (_id, lead, email) => ({ from: 'sales@example.com', to: [email], subject: 'Oferta', text: lead.name, html: '<p>Oferta</p>', headers: {} });
async function seed(id = 'lead1', change = {}) { await db.collection('leads').doc(id).set({ ...eligible, ...change }); }

test('rules: public capture persists normalized email; no reads, control fields or invalid emails', async () => {
  const client = env.unauthenticatedContext().firestore();
  const data = { ...eligible, initials: 'CL', whatsapp: '(86) 99999-9999', whatsappUrl: 'https://wa.me/5586999999999', model: 'cg160', modelDisplay: 'Honda CG 160', unit: 'TERESINA', createdAt: serverTimestamp() };
  await assertSucceeds(setDoc(doc(client, 'leads', 'public'), data));
  assert.equal((await db.doc('leads/public').get()).get('email'), eligible.email);
  for (const email of ['', 'invalid', 'a@@b.com', 'UPPER@example.com', ' a@example.com', 'a@b..com']) {
    await assertFails(setDoc(doc(client, 'leads', 'bad'), { ...data, email }));
  }
  await assertFails(setDoc(doc(client, 'leads', 'bad'), { ...data, lastOfferSentAt: Timestamp.now() }));
  await assertFails(setDoc(doc(client, 'leads', 'bad'), { ...data, offersSentCount: 3 }));
  await assertFails(getDoc(doc(client, 'leads', 'public')));
  await assertFails(updateDoc(doc(client, 'leads', 'public'), { subscribedToOffers: false }));
});

test('rules: explicit staff authorization, legacy compatibility, opt-out and server-only state', async () => {
  await db.doc('leads/legacy').set({ name: 'Legado', status: 'NOVO' });
  const staff = env.authenticatedContext('staff', { crmStaff: true }).firestore();
  const outsider = env.authenticatedContext('outsider').firestore();
  await assertFails(getDoc(doc(outsider, 'leads', 'legacy')));
  await assertSucceeds(getDoc(doc(staff, 'leads', 'legacy')));
  await assertSucceeds(updateDoc(doc(staff, 'leads', 'legacy'), { status: 'EM_CONTATO' }));
  await assertSucceeds(updateDoc(doc(staff, 'leads', 'legacy'), { email: '', subscribedToOffers: false }));
  await assertFails(updateDoc(doc(staff, 'leads', 'legacy'), { email: 'bad' }));
  await assertFails(updateDoc(doc(staff, 'leads', 'legacy'), { subscribedToOffers: true }));
  await assertFails(updateDoc(doc(staff, 'leads', 'legacy'), { offersSentCount: 99 }));
  await assertFails(updateDoc(doc(staff, 'leads', 'legacy'), { lastOfferSentAt: Timestamp.now() }));
  await assertFails(setDoc(doc(staff, 'offerDeliveries', 'legacy'), { status: 'accepted' }));
  await assertFails(getDoc(doc(staff, 'offerDeliveries', 'legacy')));
  await assertFails(setDoc(doc(staff, 'offerJobs', 'monthlyOffers'), { cursor: 'tamper' }));
  await seed();
  await assertFails(updateDoc(doc(staff, 'leads', 'lead1'), { email: 'new@example.com' }));
  await assertSucceeds(updateDoc(doc(staff, 'leads', 'lead1'), { email: 'new@example.com', subscribedToOffers: false }));
});

test('concurrent workers and manual retries produce one provider call and one counter increment', async () => {
  await seed();
  let calls = 0;
  const processor = new OfferProcessor(db, { send: async () => { calls++; return 'accepted'; } }, message);
  const results = await Promise.all(Array.from({ length: 6 }, () => processor.process('lead1')));
  assert.equal(results.filter((x) => x === 'accepted').length, 1);
  assert.equal(calls, 1);
  assert.equal(await processor.process('lead1'), 'skipped');
  const saved = (await db.doc('leads/lead1').get()).data();
  assert.equal(saved.offersSentCount, 1);
  assert.ok(saved.lastOfferSentAt instanceof Timestamp);
});

test('timeout after provider acceptance retries immutable request and counts only once', async () => {
  await seed();
  let now = Date.now(), calls = 0;
  const delivered = new Map();
  const provider = { send: async (payload, key) => {
    calls++;
    if (delivered.has(key)) { assert.deepEqual(payload, delivered.get(key)); return 'accepted'; }
    delivered.set(key, payload);
    throw new Error('Simulate response lost AFTER provider acceptance');
  } };
  const processor = new OfferProcessor(db, provider, message, () => now);
  assert.equal(await processor.process('lead1'), 'pending');
  assert.equal((await db.doc('leads/lead1').get()).get('lastOfferSentAt'), undefined);
  await db.doc('leads/lead1').update({ name: 'Changed after first attempt' });
  now += LEASE_MS + 1;
  assert.equal(await processor.process('lead1'), 'accepted');
  assert.equal(calls, 2);
  assert.equal(delivered.size, 1);
  assert.equal((await db.doc('leads/lead1').get()).get('offersSentCount'), 1);
});

test('expired ambiguous delivery blocks automatic resend, even after 30 days', async () => {
  await seed();
  let now = Date.now(), calls = 0;
  const processor = new OfferProcessor(db, { send: async () => { calls++; throw new Error('timeout'); } }, message, () => now);
  assert.equal(await processor.process('lead1'), 'pending');
  now += RETRY_WINDOW_MS;
  assert.equal(await processor.process('lead1'), 'review');
  now += OFFER_INTERVAL_MS;
  assert.equal(await processor.process('lead1'), 'review');
  assert.equal(calls, 1);
  assert.equal((await db.doc('leads/lead1').get()).get('offersSentCount'), 0);
});

test('lead history governs next cycle at exactly 30 days, regardless of scheduler date', async () => {
  await seed();
  let now = Date.now();
  const keys = [];
  const processor = new OfferProcessor(db, { send: async (_payload, key) => { keys.push(key); return key; } }, message, () => now);
  await processor.process('lead1');
  now += OFFER_INTERVAL_MS - 1;
  assert.equal(await processor.process('lead1'), 'skipped');
  now++;
  assert.equal(await processor.process('lead1'), 'accepted');
  assert.notEqual(keys[0], keys[1]);
  assert.equal((await db.doc('leads/lead1').get()).get('offersSentCount'), 2);
});

test('scheduler isolates partial failure, filters candidates, paginates and resets cursor', async () => {
  await Promise.all(Array.from({ length: 53 }, (_, i) => seed(`lead${String(i).padStart(3, '0')}`, { status: i === 52 ? 'PERDIDO' : 'NOVO' })));
  await seed('legacy', { subscribedToOffers: false });
  let calls = 0;
  const processor = new OfferProcessor(db, { send: async () => { if (++calls === 1) throw new Error('temporary failure'); return `accepted-${calls}`; } }, message);
  const result = await runOfferBatch(db, processor);
  assert.equal(result.pending, 1);
  assert.equal(result.accepted, 51);
  assert.equal(result.skipped, 1);
  assert.equal((await db.doc('offerJobs/monthlyOffers').get()).get('cursor'), '');
  assert.equal((await db.doc('leads/legacy').get()).get('lastOfferSentAt'), undefined);
});

test('unsubscribe GET is read-only; signed POST is persistent and idempotent', async () => {
  await seed();
  const secret = 'test-only-secret-with-at-least-32-bytes';
  const handler = unsubscribeHandler(db, () => secret);
  const token = createUnsubscribeToken('lead1', eligible.email, secret);
  function response() { return { statusCode: 200, set() { return this; }, type() { return this; }, status(code) { this.statusCode = code; return this; }, send(body) { this.body = body; return this; } }; }
  await handler({ method: 'GET', query: { token } }, response());
  assert.equal((await db.doc('leads/lead1').get()).get('subscribedToOffers'), true);
  const invalid = response();
  await handler({ method: 'POST', query: { token: 'lead1' } }, invalid);
  assert.equal(invalid.statusCode, 400);
  for (let i = 0; i < 2; i++) {
    const res = response();
    await handler({ method: 'POST', query: { token } }, res);
    assert.equal(res.statusCode, 200);
  }
  assert.equal((await db.doc('leads/lead1').get()).get('subscribedToOffers'), false);
  let calls = 0;
  assert.equal(await new OfferProcessor(db, { send: async () => { calls++; return 'no'; } }, message).process('lead1'), 'skipped');
  assert.equal(calls, 0);
  await seed('lead1', { email: 'other@example.com' });
  await handler({ method: 'POST', query: { token } }, response());
  assert.equal((await db.doc('leads/lead1').get()).get('subscribedToOffers'), true);
});
