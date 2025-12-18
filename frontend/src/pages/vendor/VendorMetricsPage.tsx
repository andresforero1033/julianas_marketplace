const kpis = [
  { label: 'Ticket promedio', value: '$289.000', change: '+8% vs oct' },
  { label: 'Clientes recurrentes', value: '42%', change: '+5 pp' },
  { label: 'Tasa de conversión', value: '3.4%', change: '+0.6 pp' },
];

const heatmap = [
  { label: 'D1', heightClass: 'h-[65%]' },
  { label: 'D2', heightClass: 'h-[72%]' },
  { label: 'D3', heightClass: 'h-[58%]' },
  { label: 'D4', heightClass: 'h-[80%]' },
  { label: 'D5', heightClass: 'h-[91%]' },
  { label: 'D6', heightClass: 'h-[77%]' },
  { label: 'D7', heightClass: 'h-[68%]' },
];

export default function VendorMetricsPage() {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">{kpi.label}</p>
            <p className="mt-3 text-3xl font-semibold text-stone-900">{kpi.value}</p>
            <p className="text-sm text-rose-500">{kpi.change}</p>
          </article>
        ))}
      </div>

      <article className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Performance semanal</p>
            <h2 className="text-xl font-semibold text-stone-900">Ventas por día</h2>
          </div>
          <span className="rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white">+18% mes a mes</span>
        </header>
        <div className="mt-6 flex gap-3">
          {heatmap.map((point) => (
            <div key={point.label} className="flex-1">
              <div className="flex h-40 items-end rounded-2xl bg-stone-100">
                <div className={`w-full rounded-2xl bg-rose-500 ${point.heightClass}`} />
              </div>
              <p className="mt-2 text-center text-xs text-stone-500">{point.label}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
