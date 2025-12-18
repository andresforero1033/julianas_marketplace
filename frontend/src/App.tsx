import type { ChangeEvent } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import type { Role } from './context/AuthContext.tsx';
import { useAuth } from './hooks/useAuth.ts';

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/buscar', label: 'Buscar' },
  { to: '/carrito', label: 'Carrito' },
  { to: '/panel/vendedora', label: 'Panel vendedora' },
  { to: '/panel/admin', label: 'Panel admin' },
  { to: '/registro', label: 'Registro' },
];

const roadmapSignals = [
  { label: 'Routing', status: 'Listo', tone: 'text-success' },
  { label: 'Layout', status: 'En curso', tone: 'text-warning' },
  { label: 'Auth Views', status: 'Siguiente', tone: 'text-primary' },
];

const roleLabels: Record<Role, string> = {
  buyer: 'Compradora',
  vendor: 'Vendedora',
  admin: 'Administradora',
};

function App() {
  const { user, roles, loginAs, logout } = useAuth();

  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextRole = event.target.value as Role;

    if (!nextRole) {
      logout();
      return;
    }

    loginAs(nextRole);
  };

  return (
    <div className="min-h-screen bg-light text-text">
      <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-white via-light to-white">
        {/* Soft glow to match premium marketplace branding */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[320px] bg-gradient-to-b from-secondary/40 via-white to-transparent blur-3xl" />

        <header className="border-b border-white/60 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Juliana’s</span>
                <span className="rounded-full bg-light px-3 py-1 text-xs font-semibold text-muted">Fase 3</span>
              </div>
              <p className="mt-2 text-2xl font-serif text-text">Frontend Core</p>
              <p className="text-sm text-muted">
                Routing y layout listos para montar login, catálogo y dashboards multivendedor.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="rounded-full border border-muted px-5 py-2 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
                to="/login"
              >
                Iniciar sesión
              </Link>
              <Link className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30" to="/registro">
                Crear cuenta
              </Link>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/80 p-4 text-xs text-muted">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Sesión de prueba</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <label className="sr-only" htmlFor="session-role-select">
                  Seleccionar rol de sesión
                </label>
                <select
                  className="rounded-2xl border border-muted/50 bg-white px-4 py-2 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  id="session-role-select"
                  onChange={handleRoleChange}
                  value={user?.role ?? ''}
                >
                  <option value="">Invitada</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {roleLabels[role]}
                    </option>
                  ))}
                </select>
                <span className="rounded-2xl bg-light px-4 py-2 font-semibold text-text">
                  {user ? `${user.name} · ${roleLabels[user.role]}` : 'Sin sesión activa'}
                </span>
                {user ? (
                  <button
                    className="rounded-full border border-muted px-4 py-2 font-semibold text-text transition hover:border-primary hover:text-primary"
                    onClick={logout}
                    type="button"
                  >
                    Cerrar sesión
                  </button>
                ) : (
                  <Link className="rounded-full border border-muted px-4 py-2 font-semibold text-text transition hover:border-primary hover:text-primary" to="/login">
                    Acceder
                  </Link>
                )}
              </div>
            </div>
          </div>

          <nav className="border-t border-white/60">
            <div className="mx-auto flex max-w-6xl flex-wrap gap-3 px-6 py-4 text-sm font-semibold">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  className={({ isActive }) =>
                    [
                      'rounded-full px-4 py-2 transition',
                      isActive
                        ? 'bg-primary text-white shadow-sm shadow-primary/30'
                        : 'text-muted hover:text-text hover:bg-light',
                    ].join(' ')
                  }
                  to={link.to}
                  end={link.to === '/'}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="border-t border-white/60 bg-white/70">
            <div className="mx-auto flex max-w-6xl flex-wrap gap-4 px-6 py-4 text-xs uppercase tracking-[0.3em] text-muted">
              {roadmapSignals.map((signal) => (
                <span
                  key={signal.label}
                  className="inline-flex items-center gap-2 rounded-full bg-light px-4 py-2 text-[11px] font-semibold"
                >
                  <span className={`h-2 w-2 rounded-full ${signal.tone.replace('text-', 'bg-')}`} aria-hidden="true" />
                  <span>{signal.label}</span>
                  <span className={signal.tone}>{signal.status}</span>
                </span>
              ))}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 lg:px-10 lg:py-12">
          <Outlet />
        </main>

        <footer className="border-t border-white/60 bg-white/80">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-muted lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-text font-semibold">Roadmap inmediato</p>
              <p>Layout listo → auth screens → catálogo → dashboards.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-light px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">React + Vite</span>
              <span className="rounded-full bg-light px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">Tailwind 3.4</span>
              <span className="rounded-full bg-light px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">Mongo + Express backend</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
