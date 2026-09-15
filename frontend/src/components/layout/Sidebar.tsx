import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../services/firebase/auth';
import logoUrl from '../../assets/logo_sol_nascente.jpg';

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
] as const;

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-surface-container-lowest z-50 flex flex-col justify-between border-r border-surface-container-highest shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col">
        {/* Branding */}
        <div className="h-16 px-space-md flex items-center gap-space-sm border-b border-surface-container-highest">
          <img
            src={logoUrl}
            alt="Sol Nascente CRM Honda"
            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-label-lg text-on-surface truncate leading-tight">Sol Nascente</span>
            <span className="font-label-sm text-primary uppercase font-bold tracking-wider">CRM Honda</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-space-xs p-space-sm">
          {NAV_ITEMS.map(({ path, icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-space-sm px-space-sm py-space-sm rounded-xl bg-primary-container text-on-primary font-bold shadow-sm transition-colors'
                  : 'flex items-center gap-space-sm px-space-sm py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors'
              }
            >
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
              <span className="font-label-lg">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User + Logout */}
      <div className="p-space-sm border-t border-surface-container-highest flex flex-col gap-space-sm">
        <div className="flex items-center gap-space-sm p-space-xs rounded-xl bg-surface-container-low">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-on-secondary font-label-md font-bold">
            CM
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-label-md text-on-surface font-semibold truncate leading-none">João Matheus</span>
            <span className="font-label-sm text-on-surface-variant truncate mt-space-xs leading-none">Administrador</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-between px-space-sm py-space-xs rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer w-full"
          aria-label="Sair da conta"
        >
          <span className="font-label-md font-medium">Sair</span>
          <span className="material-symbols-outlined text-[18px]">logout</span>
        </button>
      </div>
    </aside>
  );
}
