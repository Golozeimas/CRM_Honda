import { randomUUID } from 'node:crypto';
import { FieldPath, type Firestore } from 'firebase-admin/firestore';
import type { OfferProcessor, ProcessResult } from './processor';

/** Durable cursor prevents early eligible leads from starving later pages. */
export async function runOfferBatch(db: Firestore, processor: OfferProcessor, now: () => number = Date.now) {
  const stateRef = db.collection('offerJobs').doc('monthlyOffers');
  const owner = randomUUID();
  const started = now();
  const state = await db.runTransaction(async (tx) => {
    const snap = await tx.get(stateRef);
    if ((snap.get('leaseUntil') ?? 0) > started) return null;
    const cursor = String(snap.get('cursor') ?? '');
    tx.set(stateRef, { owner, cursor, leaseUntil: started + 540000 });
    return { cursor };
  });
  if (!state) return { busy: true };
  const counts: Record<ProcessResult | 'failed', number> = { skipped: 0, accepted: 0, pending: 0, review: 0, failed: 0 };
  let cursor = state.cursor;
  try {
    while (now() - started < 360000) {
      let query = db.collection('leads').where('subscribedToOffers', '==', true).orderBy(FieldPath.documentId()).limit(50);
      if (cursor) query = query.startAfter(cursor);
      const page = await query.get();
      if (page.empty) { cursor = ''; break; }
      for (const lead of page.docs) {
        if (now() - started >= 360000) break;
        try { counts[await processor.process(lead.id)]++; }
        catch { counts.failed++; }
        cursor = lead.id;
        // If the process dies, resume after the last completed lead, not from page 1.
        await stateRef.update({ cursor });
      }
      if (page.size < 50 && cursor === page.docs[page.size - 1].id) { cursor = ''; break; }
    }
  } finally {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(stateRef);
      if (snap.get('owner') === owner) tx.update(stateRef, { cursor, leaseUntil: 0, counts });
    });
  }
  return counts;
}
