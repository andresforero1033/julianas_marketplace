const highlights = [
  { label: 'Ingresos mes', value: '$18.4M', trend: '+12% vs oct', accent: 'text-rose-500' },
  { label: 'Pedidos activos', value: '34', trend: '5 en preparación', accent: 'text-stone-900' },
  { label: 'Productos publicados', value: '58', trend: '3 pendientes de revisión', accent: 'text-stone-900' },
];

const timeline = [
  { title: 'Confirmar pedido #JU-1843', time: 'Hoy · 10:30 am', status: 'En curso' },
  { title: 'Actualizar inventario colecc. verano', time: 'Hoy · 4:00 pm', status: 'Pendiente' },
  { title: 'Reunión con Juliana', time: 'Mañana · 9:00 am', status: 'Agendado' },
];

const funnel = [
  { label: 'Pagados', count: 18, widthClass: 'w-[72%]', color: 'bg-rose-500' },
  { label: 'Preparando', count: 9, widthClass: 'w-[36%]', color: 'bg-amber-400' },
  { label: 'Despachados', count: 7, widthClass: 'w-[28%]', color: 'bg-emerald-400' },
];

export default function VendorDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.label} className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">{item.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
            <p className="text-sm text-stone-500">{item.trend}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Embudo</p>
              <h2 className="text-xl font-semibold text-stone-900">Estado de pedidos</h2>
            </div>
            <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">Tiempo real</span>
          </header>
          <div className="mt-6 space-y-4">
            {funnel.map((stage) => (
              <div key={stage.label}>
                <div className="flex items-center justify-between text-sm">
                  <span>{stage.label}</span>
                  <span>{stage.count}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-stone-100">
                  <div className={`h-full rounded-full ${stage.color} ${stage.widthClass}`} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Agenda</p>
          <h2 className="text-xl font-semibold text-stone-900">Prioridades de hoy</h2>
          <ul className="mt-4 space-y-4">
            {timeline.map((event) => (
              <li key={event.title} className="rounded-2xl border border-stone-100 p-4">
                <p className="text-sm font-semibold text-stone-900">{event.title}</p>
                <p className="text-xs text-stone-500">{event.time}</p>
                <span className="mt-2 inline-flex rounded-full bg-stone-900/5 px-3 py-1 text-xs font-semibold text-stone-600">{event.status}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
