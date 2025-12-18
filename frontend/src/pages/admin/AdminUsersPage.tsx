const users = [
  { name: 'Juliana M.', role: 'Admin', status: 'Activo', brands: '-' },
  { name: 'Laura G.', role: 'Vendedora', status: 'Activo', brands: 'Flor de Loto' },
  { name: 'Ana R.', role: 'Vendedora', status: 'Revision', brands: 'Isla Palma' },
  { name: 'Carolina T.', role: 'Compradora', status: 'Suspendido', brands: '-' },
];

export default function AdminUsersPage() {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">Gestión de usuarios</h2>
          <p className="text-sm text-stone-500">Alta, baja y cambios en roles del marketplace.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-900 hover:border-stone-900">
            Invitar admin
          </button>
          <button type="button" className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800">
            Nueva vendedora
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-stone-100 text-sm">
          <thead className="bg-stone-50 text-left uppercase tracking-[0.3em] text-xs text-stone-500">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Rol</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Marca asignada</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.map((user) => (
              <tr key={user.name}>
                <td className="px-6 py-4 font-semibold text-stone-900">{user.name}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-stone-900/5 px-3 py-1 text-xs font-semibold text-stone-600">{user.status}</span>
                </td>
                <td className="px-6 py-4">{user.brands}</td>
                <td className="px-6 py-4 text-right">
                  <button type="button" className="rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold text-stone-600 hover:border-stone-900">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
