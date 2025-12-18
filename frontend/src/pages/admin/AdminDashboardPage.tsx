const stats = [
  { label: 'GMV mes actual', value: '$128M', change: '+22% vs mes previo' },
  { label: 'Vendedoras activas', value: '34', change: '+4 nuevas' },
  { label: 'Pedidos en curso', value: '186', change: '58 pendientes de despacho' },
];

const alerts = [
  { title: 'Verificar documentos nueva marca', detail: 'Studio Orquídea espera aprobación', severity: 'Alta' },
  { title: 'Revisar SLA de envíos', detail: 'Transportadora demorando +12h', severity: 'Media' },
  { title: 'Backlog soporte', detail: '18 tickets abiertos', severity: 'Media' },
];

export default function AdminDashboardPage() {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-stone-900">{stat.value}</p>
            <p className="text-sm text-rose-500">{stat.change}</p>
          </article>
        ))}
      </div>

      <article className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Alertas operativas</p>
            <h2 className="text-xl font-semibold text-stone-900">Seguimiento</h2>
          </div>
          <button type="button" className="rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-900 hover:border-stone-900">
            Crear tarea
          </button>
        </header>
        <ul className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <li key={alert.title} className="rounded-2xl border border-stone-100 p-4 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-stone-900">{alert.title}</p>
                <span className="rounded-full bg-stone-900/5 px-3 py-1 text-xs font-semibold text-stone-600">{alert.severity}</span>
              </div>
              <p className="text-stone-500">{alert.detail}</p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
