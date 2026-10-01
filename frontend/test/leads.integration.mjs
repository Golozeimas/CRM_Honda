import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { connectFirestoreEmulator, doc, getDoc, updateDoc, terminate } from 'firebase/firestore';

test('actual createLead/updateLead services persist normalized email and preserve legacy/opt-out', async () => {
  if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error('Run through Firebase emulators:exec');
  process.env.VITE_FIREBASE_PROJECT_ID = 'demo-crm-offers';
  process.env.VITE_FIREBASE_API_KEY = 'demo-key';
  process.env.VITE_FIREBASE_AUTH_DOMAIN = 'demo-crm-offers.firebaseapp.com';
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  let db;
  try {
    ({ db } = await server.ssrLoadModule('/src/services/firebase/config.ts'));
    const [host, port] = process.env.FIRESTORE_EMULATOR_HOST.split(':');
    connectFirestoreEmulator(db, host, Number(port), { mockUserToken: { sub: 'test-staff', crmStaff: true } });
    const { createLead } = await server.ssrLoadModule('/src/services/leads/createLead.ts');
    const { updateLead } = await server.ssrLoadModule('/src/services/leads/updateLead.ts');
    const input = { name: 'Cliente Teste', phone: '(86) 99999-9999', model: 'cg160', unit: 'teresina', email: '  CLIENTE@Example.com  ', subscribedToOffers: true };
    const id = await createLead(input);
    const ref = doc(db, 'leads', id);
    assert.equal((await getDoc(ref)).data().email, 'cliente@example.com');
    assert.equal((await getDoc(ref)).data().subscribedToOffers, true);
    await assert.rejects(createLead({ ...input, email: 'invalid' }), /e-mail válido/);
    const edit = { name: 'Cliente Teste', whatsapp: input.phone, model: input.model, unit: 'TERESINA' };
    await assert.rejects(updateLead(id, { ...edit, email: 'bad' }), /e-mail válido/);
    assert.equal((await getDoc(ref)).data().email, 'cliente@example.com');
    await updateLead(id, { ...edit, email: ' NEW@Example.com ' });
    assert.equal((await getDoc(ref)).data().email, 'new@example.com');
    assert.equal((await getDoc(ref)).data().subscribedToOffers, false);
    await updateLead(id, edit);
    assert.equal((await getDoc(ref)).data().email, 'new@example.com');
    await updateLead(id, { ...edit, email: '' });
    assert.equal((await getDoc(ref)).data().email, '');

    // A stale open editor must never re-enable consent after a public unsubscribe.
    const subscribedId = await createLead(input);
    await updateDoc(doc(db, 'leads', subscribedId), { subscribedToOffers: false });
    await updateLead(subscribedId, { ...edit, email: 'cliente@example.com' });
    assert.equal((await getDoc(doc(db, 'leads', subscribedId))).data().subscribedToOffers, false);

    // Seed a pre-feature document using the emulator's Admin REST owner credential.
    const legacy = 'legacy-service-test';
    const endpoint = `http://${process.env.FIRESTORE_EMULATOR_HOST}/v1/projects/demo-crm-offers/databases/(default)/documents/leads/${legacy}`;
    const response = await fetch(endpoint, { method: 'PATCH', headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { name: { stringValue: 'Legado' }, status: { stringValue: 'NOVO' } } }) });
    assert.ok(response.ok);
    await updateLead(legacy, { ...edit, email: '' });
    assert.equal((await getDoc(doc(db, 'leads', legacy))).data().email, '');
    assert.equal((await getDoc(doc(db, 'leads', legacy))).data().subscribedToOffers, false);
  } finally {
    if (db) await terminate(db);
    await server.close();
  }
});
