export type LeadStatus = 'NOVO' | 'EM_CONTATO' | 'CONVERTIDO' | 'PERDIDO';

export interface Lead {
  id: string;
  /** Display name, e.g. "Andrew Peterson" */
  name: string;
  /** Avatar initials, e.g. "AP" */
  initials: string;
  email: string;
  /** Formatted phone number, e.g. "(86) 98124-9010" */
  whatsapp: string;
  /** wa.me URL derived from the E.164 phone number */
  whatsappUrl: string;
  /** Internal model key, e.g. "CG 160" */
  model: string;
  /** Display label for the model badge */
  modelDisplay: string;
  unit: 'TERESINA' | 'TIMON';
  status: LeadStatus;
  /** Pre-formatted date string for table display, e.g. "15/09/2026 01:32" */
  createdAt: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export type AuthErrorCode =
  | 'auth/invalid-credential'
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/too-many-requests'
  | 'auth/network-request-failed'
  | 'auth/user-not-found'
  | 'auth/wrong-password';
