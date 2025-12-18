const regions = [
  { name: 'Bogotá', gmv: '$48M', orders: 620 },
  { name: 'Medellín', gmv: '$24M', orders: 310 },
  { name: 'Costa Caribe', gmv: '$18M', orders: 205 },
  { name: 'Pereira', gmv: '$9M', orders: 110 },
];

export default function AdminMetricsPage() {
  return (
    <section className="space-y-6">
      <article className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">KPI Globales</p>
            <h2 className="text-xl font-semibold text-stone-900">Salud del marketplace</h2>
          </div>
          <button type="button" className="rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-900 hover:border-stone-900">
            Descargar reporte
          </button>
        </header>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-stone-100 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Retención 90d</p>
            <p className="mt-2 text-3xl font-semibold text-stone-900">62%</p>
            <p className="text-sm text-rose-500">+4 pp vs trimestre anterior</p>
          </div>
          <div className="rounded-2xl border border-stone-100 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Tasa de conversión</p>
            <p className="mt-2 text-3xl font-semibold text-stone-900">2.8%</p>
            <p className="text-sm text-rose-500">Objetivo 3.2%</p>
          </div>
          <div className="rounded-2xl border border-stone-100 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">NPS</p>
            <p className="mt-2 text-3xl font-semibold text-stone-900">64</p>
            <p className="text-sm text-rose-500">+6 pts en el trimestre</p>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Mapa de ventas</p>
        <h2 className="text-xl font-semibold text-stone-900">Regiones prioritarias</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {regions.map((region) => (
            <div key={region.name} className="rounded-2xl border border-stone-100 p-4">
              <p className="text-sm font-semibold text-stone-900">{region.name}</p>
              <p className="text-xl text-stone-900">{region.gmv}</p>
              <p className="text-sm text-stone-500">{region.orders} pedidos</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
