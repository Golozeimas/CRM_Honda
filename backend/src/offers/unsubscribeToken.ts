import { createHmac, timingSafeEqual } from 'node:crypto';

interface UnsubscribeClaims { leadId: string; email: string }

function signature(payload: string, secret: string): Buffer {
  if (Buffer.byteLength(secret) < 32) throw new Error('UNSUBSCRIBE_SECRET must contain at least 32 bytes');
  return createHmac('sha256', secret).update(`offers-unsubscribe:v1:${payload}`).digest();
}

export function createUnsubscribeToken(leadId: string, email: string, secret: string): string {
  const payload = Buffer.from(JSON.stringify({ leadId, email })).toString('base64url');
  return `${payload}.${signature(payload, secret).toString('base64url')}`;
}

export function verifyUnsubscribeToken(token: string, secret: string): UnsubscribeClaims | null {
  if (token.length > 2048) return null;
  const [payload, mac, extra] = token.split('.');
  if (!payload || !mac || extra !== undefined) return null;
  const actual = Buffer.from(mac, 'base64url');
  const expected = signature(payload, secret);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const claims: unknown = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!claims || typeof claims !== 'object' || !('leadId' in claims) || !('email' in claims)) return null;
    if (typeof claims.leadId !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(claims.leadId) || typeof claims.email !== 'string') return null;
    return { leadId: claims.leadId, email: claims.email };
  } catch {
    return null;
  }
}
