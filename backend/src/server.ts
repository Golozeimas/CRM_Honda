import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest } from 'firebase-functions/v2/https';
import { defineBoolean, defineSecret, defineString } from 'firebase-functions/params';
import * as logger from 'firebase-functions/logger';
import { db } from './config/firebase';
import { ResendProvider } from './offers/provider';
import { OfferProcessor } from './offers/processor';
import { runOfferBatch } from './offers/scheduler';
import { renderOffer, requireHttpsUrl } from './offers/template';
import { createUnsubscribeToken } from './offers/unsubscribeToken';
import { unsubscribeHandler } from './offers/unsubscribe';
import { isValidEmail } from './domain/email';

const apiKey = defineSecret('RESEND_API_KEY');
const unsubscribeSecret = defineSecret('UNSUBSCRIBE_SECRET');
const enabled = defineBoolean('OFFERS_ENABLED', { default: false });
const from = defineString('OFFERS_FROM', { default: '' });
const subject = defineString('OFFERS_SUBJECT', { default: '' });
const body = defineString('OFFERS_BODY', { default: '' });
const offerUrl = defineString('OFFERS_URL', { default: '' });
const unsubscribeUrl = defineString('OFFERS_UNSUBSCRIBE_URL', { default: '' });

export const sendPeriodicOffers = onSchedule({
  schedule: 'every 1 hours', timeZone: 'America/Sao_Paulo', region: 'southamerica-east1',
  timeoutSeconds: 540, maxInstances: 1, retryCount: 2, minBackoffSeconds: 120,
  secrets: [apiKey, unsubscribeSecret],
}, async () => {
  if (!enabled.value()) { logger.info('offers_disabled'); return; }
  if (!isValidEmail(from.value()) || !subject.value().trim() || !body.value().trim()) {
    throw new Error('Configure OFFERS_FROM, OFFERS_SUBJECT and OFFERS_BODY before enabling offers');
  }
  const base = new URL(requireHttpsUrl(unsubscribeUrl.value()));
  const content = { subject: subject.value(), body: body.value(), url: requireHttpsUrl(offerUrl.value()) };
  const processor = new OfferProcessor(db, new ResendProvider(apiKey.value()), (leadId, lead, email) => {
    const url = new URL(base);
    url.searchParams.set('token', createUnsubscribeToken(leadId, email, unsubscribeSecret.value()));
    return renderOffer(lead, email, from.value(), content, url.toString());
  });
  const result = await runOfferBatch(db, processor);
  logger.info('offers_batch_completed', result);
  if ('pending' in result && result.pending) logger.warn('offers_pending_retry', { count: result.pending });
  if ('review' in result && result.review) logger.warn('offers_require_reconciliation', { count: result.review });
  if ('failed' in result && result.failed) throw new Error('offers_batch_partial_failure');
});

export const unsubscribeOffers = onRequest({
  region: 'southamerica-east1', secrets: [unsubscribeSecret], invoker: 'public',
  timeoutSeconds: 30, maxInstances: 5,
}, unsubscribeHandler(db, () => unsubscribeSecret.value()));
