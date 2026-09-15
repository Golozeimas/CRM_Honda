import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthErrorBanner } from './AuthErrorBanner';
import { PasswordInput } from './PasswordInput';
import { login, resetPassword, mapAuthError } from '../../services/firebase/auth';

export function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(mapAuthError(code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Informe seu e-mail no campo acima para recuperar a senha.');
      return;
    }
    setResetLoading(true);
    setError(null);
    setResetMessage(null);
    try {
      await resetPassword(email);
      setResetMessage('Se o e-mail estiver cadastrado, enviaremos instruções para redefinição da senha.');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(mapAuthError(code));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-space-md">

      {/* Error Banner */}
      {error && (
        <AuthErrorBanner
          title="Falha na Autenticação"
          message={error}
        />
      )}

      {/* Reset success */}
      {resetMessage && (
        <div className="flex items-start gap-3 bg-tertiary-container/20 rounded-xl px-4 py-3 border border-tertiary/20">
          <span className="material-symbols-outlined text-[20px] text-tertiary flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <span className="font-body-sm text-body-sm text-on-surface">{resetMessage}</span>
        </div>
      )}

      {/* Email field */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-email" className="font-label-lg text-label-lg font-semibold text-on-surface">
            E-mail
          </label>
          <span className="font-label-sm text-label-sm text-secondary bg-surface-container px-2 py-0.5 rounded-md">
            Corporativo
          </span>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-secondary pointer-events-none">
            alternate_email
          </span>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            placeholder="administrador@solnascentemotos.com.br"
            className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm border border-outline/20 focus:border-transparent"
          />
        </div>
      </div>

      {/* Password field */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="font-label-lg text-label-lg font-semibold text-on-surface">
            Senha
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetLoading}
            className="font-label-sm text-label-sm text-primary hover:underline disabled:opacity-60 cursor-pointer"
          >
            {resetLoading ? 'Enviando...' : 'Esqueceu sua senha?'}
          </button>
        </div>
        <PasswordInput
          id="login-password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(null); }}
          placeholder="••••••••••••"
          required
          autoComplete="current-password"
        />
      </div>

      {/* Remember me */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none group">
        <div className="relative flex-shrink-0">
          <input
            id="login-remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="peer sr-only"
          />
          <div className="w-5 h-5 rounded border-2 border-outline/40 bg-surface-container-lowest transition-all peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center">
            {rememberMe && (
              <span className="material-symbols-outlined text-on-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-label-lg text-label-lg text-on-surface">Manter conectado</span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">
            Produção
          </span>
        </div>
      </label>

      {/* Submit */}
      <button
        id="login-submit"
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-primary hover:bg-[#cc0000] active:bg-[#b30024] disabled:opacity-70 disabled:cursor-not-allowed text-on-primary font-headline-md text-headline-md rounded-xl shadow-md flex items-center justify-center gap-2 transition-all group cursor-pointer mt-1"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Autenticando...</span>
          </>
        ) : (
          <>
            <span>Entrar</span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </>
        )}
      </button>
    </form>
  );
}
