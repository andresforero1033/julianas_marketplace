import { Link, useLocation } from 'react-router-dom';
import type { CartItem } from '../../context/CartContext.tsx';

const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

type CheckoutSuccessState = {
  orderNumber: string;
  total: number;
  items: CartItem[];
  deliveryCost: number;
  deliveryLabel: string;
  customer: {
    name: string;
    email: string;
  };
};

export default function CheckoutSuccessPage() {
  const location = useLocation();
  const state = location.state as CheckoutSuccessState | undefined;

  if (!state) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-500">Checkout</p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-900">No encontramos una orden reciente</h1>
        <p className="mt-3 text-stone-500">Completa el formulario de checkout para generar el resumen.</p>
        <Link
          to="/checkout"
          className="mt-6 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          Ir al checkout
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8 space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-500">Paso 2 de 2</p>
        <h1 className="text-3xl font-semibold text-stone-900">Orden confirmada</h1>
        <p className="text-stone-500">Simulamos la pantalla de éxito con datos ficticios.</p>
      </header>

      <div className="space-y-6 rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Número de orden</p>
            <p className="text-2xl font-semibold text-stone-900">{state.orderNumber}</p>
          </div>
          <span className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white">Pago recibido</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Compradora</p>
            <p className="text-lg font-semibold text-stone-900">{state.customer.name}</p>
            <p className="text-sm text-stone-500">{state.customer.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Envío</p>
            <p className="text-lg font-semibold text-stone-900">{state.deliveryLabel}</p>
            <p className="text-sm text-stone-500">Costo {formatter.format(state.deliveryCost)}</p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Productos</p>
          <ul className="mt-3 divide-y divide-stone-100">
            {state.items.map((item) => (
              <li key={item.lineId} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-semibold text-stone-900">{item.name}</p>
                  <p className="text-stone-500">Cantidad {item.quantity}</p>
                </div>
                <span className="font-semibold text-stone-900">{formatter.format(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between text-lg font-semibold text-stone-900">
            <span>Total pagado</span>
            <span>{formatter.format(state.total)}</span>
          </div>
        </div>
        <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">
          Esta vista sirve como handoff para el equipo de backend, mostrando la información mínima necesaria para emails y actualización de pedidos.
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/catalogo"
            className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-900"
          >
            Seguir comprando
          </Link>
          <Link
            to="/panel/vendedora"
            className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Ver pedido en panel
          </Link>
        </div>
      </div>
    </section>
  );
}
