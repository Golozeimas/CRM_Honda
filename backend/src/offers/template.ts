import type { OfferLead } from './eligibility';
import type { EmailMessage } from './provider';

/** Real, approved commercial copy is supplied server-side, never inferred from static prices. */
export interface OfferContent { subject: string; body: string; url: string }

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}

export function requireHttpsUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Expected public HTTPS URL');
  return url.toString();
}

export function renderOffer(lead: OfferLead, email: string, from: string, content: OfferContent, unsubscribeUrl: string): EmailMessage {
  if (!content.subject.trim() || /[\r\n]/.test(content.subject) || !content.body.trim()) throw new Error('Missing or invalid offer content');
  const url = requireHttpsUrl(content.url);
  const unsubscribe = requireHttpsUrl(unsubscribeUrl);
  const name = typeof lead.name === 'string' ? lead.name : 'cliente';
  const model = typeof lead.modelDisplay === 'string' ? lead.modelDisplay : 'uma moto Honda';
  const unit = lead.unit === 'TIMON' ? 'Timon - MA' : 'Teresina - PI';
  const introduction = `Olá, ${name}! Você demonstrou interesse em ${model} na Sol Nascente Motos, unidade ${unit}.`;
  return {
    from, to: [email], subject: content.subject,
    text: `${introduction}\n\n${content.body}\n\nConfira: ${url}\n\nCancelar recebimento de ofertas: ${unsubscribe}`,
    html: `<p>${escapeHtml(introduction)}</p><p>${escapeHtml(content.body).replace(/\n/g, '<br>')}</p><p><a href="${escapeHtml(url)}">Consultar oferta</a></p><p><a href="${escapeHtml(unsubscribe)}">Cancelar recebimento de ofertas</a></p>`,
    headers: { 'List-Unsubscribe': `<${unsubscribe}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
  };
}
