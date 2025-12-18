import { NavLink, Outlet } from 'react-router-dom';

const adminTabs = [
  { to: '/panel/admin', label: 'Resumen' },
  { to: '/panel/admin/usuarios', label: 'Usuarios' },
  { to: '/panel/admin/productos', label: 'Productos' },
  { to: '/panel/admin/metricas', label: 'Métricas' },
];

export default function AdminLayout() {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Panel administrador</p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-stone-900">Control general</h1>
            <p className="text-stone-500">Usuarios, catálogo, pedidos y performance global del marketplace.</p>
          </div>
          <span className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white">Rol: Admin</span>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm">
          {adminTabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                [
                  'rounded-full px-4 py-2 font-semibold transition',
                  isActive ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-900',
                ].join(' ')
              }
              end={tab.to === '/panel/admin'}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <div className="mt-8">
        <Outlet />
      </div>
    </section>
  );
}
