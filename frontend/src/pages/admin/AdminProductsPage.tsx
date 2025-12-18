const productAudits = [
  { brand: 'Flor de Loto', sku: 'FL-221', issue: 'Falta certificación de origen', status: 'Pendiente' },
  { brand: 'Isla Palma', sku: 'IP-019', issue: 'Precio fuera de rango', status: 'En revisión' },
  { brand: 'Casa Andes', sku: 'CA-442', issue: 'Foto no aprobada', status: 'Corregido' },
];

export default function AdminProductsPage() {
  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">Catálogo global</h2>
          <p className="text-sm text-stone-500">Supervisa publicaciones y políticas de calidad.</p>
        </div>
        <button type="button" className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-900 hover:border-stone-900">
          Crear categoría
        </button>
      </header>

      <div className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Alertas de catálogo</p>
            <h3 className="text-lg font-semibold text-stone-900">Auditoría rápida</h3>
          </div>
          <span className="text-sm text-stone-500">Ultima sincronización hace 5 min</span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {productAudits.map((item) => (
            <article key={item.sku} className="rounded-2xl border border-stone-100 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400">{item.brand}</p>
              <p className="text-lg font-semibold text-stone-900">{item.sku}</p>
              <p className="text-sm text-stone-500">{item.issue}</p>
              <span className="mt-3 inline-flex rounded-full bg-stone-900/5 px-3 py-1 text-xs font-semibold text-stone-600">{item.status}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
