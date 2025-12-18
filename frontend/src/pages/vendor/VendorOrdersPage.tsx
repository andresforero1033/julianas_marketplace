const orders = [
  { id: 'JU-1839', customer: 'María L.', total: '$320.000', status: 'Pagado', eta: 'Entrega 19 dic' },
  { id: 'JU-1840', customer: 'Daniela S.', total: '$210.000', status: 'Preparando', eta: 'Courier recoge hoy' },
  { id: 'JU-1841', customer: 'Ana P.', total: '$760.000', status: 'Despachado', eta: 'Guía 771923' },
  { id: 'JU-1842', customer: 'Luisa R.', total: '$158.000', status: 'Pendiente', eta: 'Esperando pago' },
];

export default function VendorOrdersPage() {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">Pedidos recientes</h2>
          <p className="text-sm text-stone-500">Visibilidad rápida de pagos, preparación y despachos.</p>
        </div>
        <button type="button" className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-900 hover:border-stone-900">
          Exportar
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-stone-900">{order.id}</p>
              <span className="rounded-full bg-stone-900/5 px-3 py-1 text-xs font-semibold text-stone-600">{order.status}</span>
            </div>
            <p className="text-lg text-stone-900">{order.total}</p>
            <p className="text-sm text-stone-500">{order.customer}</p>
            <p className="text-xs text-stone-400">{order.eta}</p>
            <div className="mt-4 flex gap-2 text-xs">
              <button type="button" className="rounded-full border border-stone-200 px-3 py-1 font-semibold text-stone-600 hover:border-stone-900">
                Ver detalle
              </button>
              <button type="button" className="rounded-full border border-stone-200 px-3 py-1 font-semibold text-stone-600 hover:border-stone-900">
                Actualizar estado
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
