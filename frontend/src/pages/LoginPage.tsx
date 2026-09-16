import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../contexts/useAuth';
import logoUrl from '../assets/logo_sol_nascente.jpg';

export function LoginPage() {
  const { user, loading } = useAuth();

  // Already authenticated → go straight to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blurred background blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[440px] bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden">
        {/* Red top accent bar */}
        <div className="h-1.5 w-full bg-primary" />

        <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col gap-space-md sm:gap-space-lg">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3 text-center">
            <img
              src={logoUrl}
              alt="Sol Nascente Honda"
              className="w-14 h-14 rounded-2xl object-cover shadow-md"
            />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xl sm:text-headline-xl text-on-surface font-bold tracking-tight uppercase leading-none">
                Sol Nascente - CRM
              </span>
              <div className="flex items-center mt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Honda</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-outline/10 -mx-2" />

          {/* Title */}
          <div className="flex flex-col gap-1 text-center">
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Acesso administrativo
            </h1>
            <p className="font-body-md text-body-md text-secondary">
              Entre para gerenciar seus leads.
            </p>
          </div>

          {/* Form */}
          <LoginForm />
        </div>

        {/* Footer */}
        <div className="bg-surface-container px-4 py-3 sm:px-8 flex items-center justify-center gap-1.5 text-center">
          <span className="material-symbols-outlined text-[14px] text-tertiary flex-shrink-0">verified_user</span>
          <span className="font-label-sm text-label-sm text-secondary">
            Acesso restrito · Dados protegidos pela LGPD
          </span>
        </div>
      </div>
    </div>
  );
}
