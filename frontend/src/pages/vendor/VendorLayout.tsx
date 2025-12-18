import { NavLink, Outlet } from 'react-router-dom';

const vendorTabs = [
  { to: '/panel/vendedora', label: 'Resumen' },
  { to: '/panel/vendedora/productos', label: 'Catálogo' },
  { to: '/panel/vendedora/pedidos', label: 'Pedidos' },
  { to: '/panel/vendedora/metricas', label: 'Métricas' },
];

export default function VendorLayout() {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-rose-500">Panel de vendedora</p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-stone-900">Central de marca</h1>
            <p className="text-stone-500">Control de catálogo, pedidos y métricas específicas para cada vendor.</p>
          </div>
          <span className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white">Rol: Vendedora</span>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm">
          {vendorTabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                [
                  'rounded-full px-4 py-2 font-semibold transition',
                  isActive ? 'bg-rose-500 text-white' : 'text-stone-500 hover:text-stone-900',
                ].join(' ')
              }
              end={tab.to === '/panel/vendedora'}
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
