import { randomUUID } from 'node:crypto';
import { FieldValue, Timestamp, type Firestore } from 'firebase-admin/firestore';
import { normalizeEmail } from '../domain/email';
import { isEligibleForOffers, type OfferLead } from './eligibility';
import { EmailProviderError, type EmailMessage, type EmailProvider } from './provider';

export const RETRY_WINDOW_MS = 23 * 60 * 60 * 1000;
export const LEASE_MS = 2 * 60 * 1000;

export interface Delivery {
  cycleId: string;
  status: 'pending' | 'accepted' | 'review';
  firstAttemptAt: number;
  leaseUntil: number;
  owner: string;
  message: EmailMessage;
}

export type ProcessResult = 'skipped' | 'accepted' | 'pending' | 'review';
export type MessageFactory = (leadId: string, lead: OfferLead, email: string) => EmailMessage;

/** Provider calls NEVER occur inside a Firestore transaction (which can be replayed). */
export class OfferProcessor {
  constructor(
    private readonly db: Firestore,
    private readonly provider: EmailProvider,
    private readonly makeMessage: MessageFactory,
    private readonly now: () => number = Date.now,
  ) {}

  async process(leadId: string): Promise<ProcessResult> {
    const leadRef = this.db.collection('leads').doc(leadId);
    const deliveryRef = this.db.collection('offerDeliveries').doc(leadId);
    const owner = randomUUID();
    const claim = await this.db.runTransaction(async (tx): Promise<Delivery | ProcessResult> => {
      const [leadSnap, deliverySnap] = await Promise.all([tx.get(leadRef), tx.get(deliveryRef)]);
      const lead: OfferLead | undefined = leadSnap.data();
      const previous = deliverySnap.data() as Delivery | undefined;
      const now = this.now();
      if (previous?.status === 'review') return 'review';
      if (previous?.status === 'pending') {
        if (now >= previous.firstAttemptAt + RETRY_WINDOW_MS) {
          tx.update(deliveryRef, { status: 'review', reason: 'idempotency_window_expired' });
          return 'review';
        }
        if (previous.leaseUntil > now) return 'skipped';
        if (!lead || !isEligibleForOffers(lead, now) || normalizeEmail(String(lead.email)) !== previous.message.to[0]) {
          // An uncertain send must not be replaced with a new cycle or recipient.
          tx.update(deliveryRef, { status: 'review', reason: 'recipient_or_consent_changed' });
          return 'review';
        }
        const retry = { ...previous, owner, leaseUntil: now + LEASE_MS };
        tx.update(deliveryRef, { owner, leaseUntil: retry.leaseUntil });
        return retry;
      }
      if (!lead || !isEligibleForOffers(lead, now)) return 'skipped';
      const delivery: Delivery = {
        cycleId: randomUUID(), status: 'pending', firstAttemptAt: now,
        leaseUntil: now + LEASE_MS, owner,
        message: this.makeMessage(leadId, lead, normalizeEmail(String(lead.email))),
      };
      tx.set(deliveryRef, delivery);
      return delivery;
    });
    if (typeof claim === 'string') return claim;

    // Check again immediately before the external side effect, including lease ownership.
    const [currentLead, currentDelivery] = await Promise.all([leadRef.get(), deliveryRef.get()]);
    const lead = currentLead.data();
    if (!lead || !isEligibleForOffers(lead, this.now()) || normalizeEmail(String(lead.email)) !== claim.message.to[0]
      || currentDelivery.get('owner') !== owner || this.now() >= claim.leaseUntil
      || this.now() >= claim.firstAttemptAt + RETRY_WINDOW_MS) return 'skipped';

    let providerId: string;
    try {
      providerId = await this.provider.send(claim.message, claim.cycleId);
    } catch (error) {
      const code = error instanceof EmailProviderError ? error.code : 'provider_unknown_error';
      await this.db.runTransaction(async (tx) => {
        const snap = await tx.get(deliveryRef);
        if (snap.get('cycleId') === claim.cycleId && snap.get('status') === 'pending' && snap.get('owner') === owner) {
          tx.update(deliveryRef, { lastError: code, lastErrorAt: Timestamp.fromMillis(this.now()) });
        }
      });
      return 'pending';
    }

    // Provider acceptance and lead history become visible together. A failed commit
    // leaves the same immutable request pending for a safe idempotent retry.
    await this.db.runTransaction(async (tx) => {
      const [delivery, latestLead] = await Promise.all([tx.get(deliveryRef), tx.get(leadRef)]);
      if (delivery.get('cycleId') !== claim.cycleId || delivery.get('status') === 'accepted') return;
      const acceptedAt = Timestamp.fromMillis(this.now());
      tx.update(deliveryRef, { status: 'accepted', providerId, acceptedAt, leaseUntil: 0, lastError: FieldValue.delete() });
      if (latestLead.exists) {
        tx.update(leadRef, { lastOfferSentAt: acceptedAt, offersSentCount: FieldValue.increment(1) });
      }
    });
    return 'accepted';
  }
}
