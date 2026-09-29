import { isValidEmail } from '../domain/email';

export const OFFER_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000;

export interface OfferLead {
  email?: unknown;
  subscribedToOffers?: unknown;
  status?: unknown;
  lastOfferSentAt?: unknown;
  offersSentCount?: unknown;
  name?: unknown;
  modelDisplay?: unknown;
  unit?: unknown;
}

/** Unknown/malformed history fails closed; legacy absent history is allowed. */
export function timestampMillis(value: unknown): number | undefined {
  if (value === undefined) return undefined;
  if (value === null) return NaN;
  if (typeof value === 'object' && 'toMillis' in value && typeof value.toMillis === 'function') {
    const result: unknown = value.toMillis();
    if (typeof result === 'number' && Number.isFinite(result)) return result;
  }
  return NaN;
}

export function isEligibleForOffers(lead: OfferLead, now: number): boolean {
  if (lead.subscribedToOffers !== true || typeof lead.email !== 'string' || !isValidEmail(lead.email)) return false;
  if (lead.status !== 'NOVO' && lead.status !== 'EM_CONTATO') return false;
  const count = lead.offersSentCount;
  if (count !== undefined && (typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0)) return false;
  const last = timestampMillis(lead.lastOfferSentAt);
  // Absent history is a first send only when no previous acceptance is recorded.
  // Inconsistent history requires reconciliation instead of risking a duplicate.
  return last === undefined ? (count === undefined || count === 0)
    : Number.isFinite(last) && now - last >= OFFER_INTERVAL_MS;
}
