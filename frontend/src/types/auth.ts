export type LeadStatus = 'novo' | 'em_contato' | 'convertido' | 'perdido';

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  model: string;
  unit: 'teresina' | 'timon';
  status: LeadStatus;
  createdAt: unknown;
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
