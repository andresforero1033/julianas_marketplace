const productRows = [
  { id: 'AR-104', name: 'Aretes filigrana mini', stock: 24, price: 98000, status: 'Publicado' },
  { id: 'BL-221', name: 'Blazer lino sand', stock: 8, price: 420000, status: 'Borrador' },
  { id: 'BL-478', name: 'Bolso palma edición limitada', stock: 3, price: 580000, status: 'Agotado' },
  { id: 'CO-812', name: 'Collar cuarzo crudo', stock: 17, price: 150000, status: 'Publicado' },
];

const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export default function VendorProductsPage() {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">Gestión de productos</h2>
          <p className="text-sm text-stone-500">Control rápido sobre inventario y estado de publicación.</p>
        </div>
        <button type="button" className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800">
          Nuevo producto
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-stone-100 text-sm">
          <thead className="bg-stone-50 text-left uppercase tracking-[0.3em] text-xs text-stone-500">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Producto</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Precio</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {productRows.map((row) => (
              <tr key={row.id}>
                <td className="px-6 py-4 font-semibold text-stone-900">{row.id}</td>
                <td className="px-6 py-4">{row.name}</td>
                <td className="px-6 py-4">{row.stock}</td>
                <td className="px-6 py-4">{formatter.format(row.price)}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-stone-900/5 px-3 py-1 text-xs font-semibold text-stone-600">{row.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <button type="button" className="rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold text-stone-600 hover:border-stone-900">
                      Editar
                    </button>
                    <button type="button" className="rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold text-stone-600 hover:border-stone-900">
                      Inventario
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
