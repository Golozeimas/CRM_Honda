import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from './config';
import type { AuthErrorCode } from '../../types/auth';

export async function login(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<User> {
  const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
  await setPersistence(auth, persistence);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logout(): Promise<void> {
  return signOut(auth);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function onAuthChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

export function mapAuthError(code: string): string {
  const map: Record<string, string> = {
    'auth/invalid-credential': 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.',
    'auth/invalid-email': 'O endereço de e-mail é inválido.',
    'auth/user-disabled': 'Esta conta foi desativada. Entre em contato com o administrador.',
    'auth/user-not-found': 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.',
    'auth/wrong-password': 'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.',
    'auth/too-many-requests': 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.',
    'auth/network-request-failed': 'Não foi possível realizar o login. Verifique sua conexão e tente novamente.',
  } satisfies Partial<Record<AuthErrorCode, string>>;
  return map[code] ?? 'Não foi possível realizar o login. Tente novamente.';
}
