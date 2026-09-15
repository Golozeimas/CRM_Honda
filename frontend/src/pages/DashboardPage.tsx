import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { logout } from '../services/firebase/auth';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center gap-space-md p-space-lg">
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden">
        <div className="h-1.5 w-full bg-primary" />
        <div className="px-8 py-10 flex flex-col items-center gap-space-lg text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-primary text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              dashboard
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
              CRM Sol Nascente
            </span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">
              Dashboard
            </h1>
            <p className="font-body-md text-body-md text-secondary max-w-sm mx-auto">
              Autenticado como <strong className="text-on-surface">{user?.email}</strong>.
              O dashboard de gestão de leads será implementado na próxima fase.
            </p>
          </div>
          <div className="w-full bg-surface-container rounded-xl p-4 text-left flex flex-col gap-2">
            <div className="flex items-center gap-2 text-body-sm font-body-sm">
              <span className="material-symbols-outlined text-[18px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-secondary">Firebase Authentication configurado</span>
            </div>
            <div className="flex items-center gap-2 text-body-sm font-body-sm">
              <span className="material-symbols-outlined text-[18px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-secondary">Firestore foundation pronto para leads</span>
            </div>
            <div className="flex items-center gap-2 text-body-sm font-body-sm">
              <span className="material-symbols-outlined text-[18px] text-secondary">hourglass_top</span>
              <span className="text-secondary">Gestão de leads — próxima fase</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline/30 text-secondary hover:text-on-surface hover:border-outline/60 font-label-lg text-label-lg transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
