export interface EmailMessage {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
  headers: Record<string, string>;
}

export interface EmailProvider {
  send(message: EmailMessage, idempotencyKey: string): Promise<string>;
}

/** Only safe codes leave this boundary; response bodies can contain personal data. */
export class EmailProviderError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

export class ResendProvider implements EmailProvider {
  constructor(private readonly apiKey: string, private readonly request: typeof fetch = fetch) {
    if (!apiKey.trim()) throw new Error('Missing RESEND_API_KEY');
  }

  async send(message: EmailMessage, idempotencyKey: string): Promise<string> {
    try {
      const response = await this.request('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(message),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new EmailProviderError(`provider_http_${response.status}`);
      const body: unknown = await response.json();
      if (!body || typeof body !== 'object' || !('id' in body) || typeof body.id !== 'string' || !body.id) {
        throw new EmailProviderError('provider_invalid_response');
      }
      return body.id;
    } catch (error) {
      if (error instanceof EmailProviderError) throw error;
      throw new EmailProviderError('provider_network_or_timeout');
    }
  }
}
