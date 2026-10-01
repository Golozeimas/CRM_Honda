import type { Firestore } from 'firebase-admin/firestore';
import type { Request, Response } from 'express';
import { normalizeEmail } from '../domain/email';
import { verifyUnsubscribeToken } from './unsubscribeToken';
import { escapeHtml } from './template';

export function unsubscribeHandler(db: Firestore, secret: () => string) {
  return async (req: Request, res: Response): Promise<void> => {
    res.set({ 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': "default-src 'none'; form-action 'self'; frame-ancestors 'none'", 'X-Content-Type-Options': 'nosniff' });
    if (req.method !== 'GET' && req.method !== 'POST') {
      res.set('Allow', 'GET, POST').status(405).send('Método não permitido.'); return;
    }
    const token = typeof req.query.token === 'string' ? req.query.token : '';
    const claims = verifyUnsubscribeToken(token, secret());
    if (!claims) { res.status(400).send('Link de cancelamento inválido.'); return; }
    if (req.method === 'GET') {
      // Link scanners cannot unsubscribe a lead just by following the URL.
      res.type('html').send(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Cancelar ofertas</title><h1>Cancelar ofertas da Sol Nascente Motos</h1><form method="post" action="?token=${escapeHtml(token)}"><button type="submit">Confirmar cancelamento</button></form></html>`);
      return;
    }
    try {
      const ref = db.collection('leads').doc(claims.leadId);
      await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        if (snap.exists && normalizeEmail(String(snap.get('email') ?? '')) === claims.email) {
          tx.update(ref, { subscribedToOffers: false });
        }
      });
      res.status(200).send('Recebimento de ofertas cancelado para este endereço.');
    } catch {
      res.status(503).send('Não foi possível cancelar agora. Tente novamente.');
    }
  };
}
