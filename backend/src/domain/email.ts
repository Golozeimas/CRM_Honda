/** Shared by the browser and Functions; keep this module free of server imports. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const value = normalizeEmail(email);
  return value.length <= 254 && /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(value);
}

export function validateEmail(email: string, required = true): true | string {
  if (!normalizeEmail(email)) return required ? 'Informe seu e-mail.' : true;
  return isValidEmail(email) || 'Informe um e-mail válido.';
}

export function emailForPersistence(email: string, required = true): string {
  const result = validateEmail(email, required);
  if (result !== true) throw new Error(result);
  return normalizeEmail(email);
}
