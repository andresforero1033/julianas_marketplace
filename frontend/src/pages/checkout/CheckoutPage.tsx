import { useMemo, useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.ts';
import type { CartItem } from '../../context/CartContext.tsx';

const deliveryOptions = [
  {
    id: 'standard',
    label: 'Envío estándar',
    description: '3 - 5 días hábiles',
    price: 9000,
  },
  {
    id: 'express',
    label: 'Envío express',
    description: '48 horas en principales ciudades',
    price: 18000,
  },
];

const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

type CheckoutFormState = {
  fullName: string;
  email: string;
  phone: string;
  document: string;
  address: string;
  city: string;
  notes: string;
  paymentMethod: 'card' | 'transfer';
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
};

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

const initialForm: CheckoutFormState = {
  fullName: '',
  email: '',
  phone: '',
  document: '',
  address: '',
  city: '',
  notes: '',
  paymentMethod: 'card',
  cardNumber: '',
  cardName: '',
  expiry: '',
  cvv: '',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState<CheckoutFormState>(initialForm);
  const [shippingMethod, setShippingMethod] = useState(deliveryOptions[0].id);

  const deliveryCost = useMemo(() => deliveryOptions.find((option) => option.id === shippingMethod)?.price ?? 0, [shippingMethod]);
  const deliveryLabel = useMemo(() => deliveryOptions.find((option) => option.id === shippingMethod)?.label ?? '', [shippingMethod]);
  const grandTotal = subtotal + deliveryCost;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value as CheckoutFormState['paymentMethod'] }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0) {
      return;
    }

    const payload: CheckoutSuccessState = {
      orderNumber: `JU-${Date.now().toString().slice(-6)}`,
      total: grandTotal,
      items,
      deliveryCost,
      deliveryLabel,
      customer: {
        name: formData.fullName,
        email: formData.email,
      },
    };

    clearCart();
    navigate('/checkout/confirmacion', { state: payload });
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-rose-500">Checkout</p>
        <h1 className="mb-3 text-3xl font-semibold text-stone-900">Tu carrito está vacío</h1>
        <p className="mb-6 text-stone-500">Agrega productos antes de continuar con el pago.</p>
        <Link
          to="/catalogo"
          className="inline-flex items-center rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          Ir al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-500">Paso 1 de 2</p>
        <h1 className="text-3xl font-semibold text-stone-900">Checkout básico</h1>
        <p className="text-stone-500">Recopilamos datos de envío y pago para simular el flujo de compra.</p>
      </header>

      <form className="grid gap-8 lg:grid-cols-[1.4fr,0.8fr]" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">Información de envío</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-stone-700" htmlFor="fullName">
                  Nombre completo
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-stone-700" htmlFor="email">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-stone-700" htmlFor="phone">
                  Teléfono de contacto
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-stone-700" htmlFor="document">
                  Documento
                </label>
                <input
                  id="document"
                  name="document"
                  value={formData.document}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-stone-700" htmlFor="city">
                  Ciudad
                </label>
                <input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-stone-700" htmlFor="address">
                  Dirección
                </label>
                <input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-stone-700" htmlFor="notes">
                  Notas de entrega
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm"
                  rows={3}
                  placeholder="Instrucciones para el mensajero"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">Método de envío</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {deliveryOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer flex-col rounded-2xl border px-4 py-3 text-sm ${
                    shippingMethod === option.id ? 'border-stone-900 bg-stone-900/5' : 'border-stone-200'
                  }`}
                >
                  <span className="font-semibold text-stone-900">{option.label}</span>
                  <span className="text-stone-500">{option.description}</span>
                  <span className="text-stone-900">{formatter.format(option.price)}</span>
                  <input
                    className="sr-only"
                    type="radio"
                    name="shipping"
                    value={option.id}
                    checked={shippingMethod === option.id}
                    onChange={() => setShippingMethod(option.id)}
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">Pago</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-stone-700" htmlFor="paymentMethod">
                Método
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleSelectChange}
                className="rounded-2xl border border-stone-200 px-4 py-3 text-sm"
              >
                <option value="card">Tarjeta crédito / débito</option>
                <option value="transfer">Transferencia bancaria</option>
              </select>
              {formData.paymentMethod === 'card' ? (
                <>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-stone-700" htmlFor="cardNumber">
                      Número de tarjeta
                    </label>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-stone-700" htmlFor="cardName">
                      Nombre en la tarjeta
                    </label>
                    <input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-stone-700" htmlFor="expiry">
                      Expira (MM/AA)
                    </label>
                    <input
                      id="expiry"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-stone-700" htmlFor="cvv">
                      CVV
                    </label>
                    <input
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm"
                      required
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-stone-500">
                  Te enviaremos las instrucciones de pago una vez confirmes la orden.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">Resumen</p>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.lineId} className="flex justify-between text-sm">
                  <div>
                    <p className="font-semibold text-stone-900">{item.name}</p>
                    <p className="text-stone-500">x{item.quantity}</p>
                  </div>
                  <span className="font-semibold text-stone-900">{formatter.format(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-500">Subtotal</dt>
                <dd className="font-semibold text-stone-900">{formatter.format(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Envío ({deliveryLabel})</dt>
                <dd className="font-semibold text-stone-900">{formatter.format(deliveryCost)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between text-lg font-semibold text-stone-900">
              <span>Total</span>
              <span>{formatter.format(grandTotal)}</span>
            </div>
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Confirmar compra
            </button>
          </section>
          <div className="rounded-3xl border border-dashed border-stone-200 p-4 text-sm text-stone-500">
            Los datos se enviarán al contexto de confirmación para simular el paso final del checkout.
          </div>
        </aside>
      </form>
    </section>
  );
}
