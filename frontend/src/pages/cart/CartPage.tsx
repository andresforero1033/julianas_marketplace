import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.ts';

export default function CartPage() {
    const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
    const isEmpty = items.length === 0;

    if (isEmpty) {
        return (
            <section className="mx-auto max-w-4xl px-4 py-12 text-center">
                <p className="mb-4 text-sm uppercase tracking-wide text-rose-500">Carrito</p>
                <h1 className="mb-3 text-3xl font-semibold text-stone-900">Tu carrito está vacío</h1>
                <p className="mb-6 text-stone-500">Explora el catálogo y agrega productos para continuar con la compra.</p>
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
        <section className="mx-auto max-w-5xl px-4 py-10">
            <header className="mb-8">
                <p className="text-sm uppercase tracking-wide text-rose-500">Carrito</p>
                <h1 className="text-3xl font-semibold text-stone-900">Revisa tus productos</h1>
                <p className="text-stone-500">Ajusta cantidades, elimina productos o continúa con el pago.</p>
            </header>

            <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
                <div className="space-y-4">
                    {items.map((item) => (
                        <article key={item.lineId} className="flex gap-4 rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                            <img src={item.image} alt={item.name} className="h-28 w-28 rounded-xl object-cover" />
                            <div className="flex flex-1 flex-col">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-stone-400">{item.brand}</p>
                                        <h2 className="text-lg font-semibold text-stone-900">{item.name}</h2>
                                        {item.variants.length > 0 ? (
                                            <div className="mt-1 space-y-1 text-sm text-stone-500" role="list">
                                                {item.variants.map((variant) => (
                                                    <div key={variant.groupId} className="flex gap-1" role="listitem">
                                                        <span className="text-stone-400">{variant.groupName}:</span>
                                                        <span>{variant.optionLabel}</span>
                                                        {variant.priceModifier !== 0 ? (
                                                            <span className="text-rose-500">
                                                                {variant.priceModifier > 0
                                                                    ? `+$${variant.priceModifier.toFixed(0)}`
                                                                    : `-$${Math.abs(variant.priceModifier).toFixed(0)}`}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                    <button type="button" onClick={() => removeItem(item.lineId)} className="text-sm font-medium text-rose-500 hover:text-rose-600">
                                        Quitar
                                    </button>
                                </div>
                                <div className="mt-auto flex items-center justify-between">
                                    <div className="inline-flex items-center rounded-full border border-stone-200">
                                        <label className="sr-only" htmlFor={`line-quantity-${item.lineId}`}>
                                            Cantidad para {item.name}
                                        </label>
                                        <button
                                            type="button"
                                            className="px-3 py-2 text-sm text-stone-500 hover:text-stone-900"
                                            onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <input
                                            id={`line-quantity-${item.lineId}`}
                                            type="number"
                                            min={1}
                                            max={item.maxQuantity}
                                            value={item.quantity}
                                            onChange={(event) => updateQuantity(item.lineId, Number(event.target.value))}
                                            className="w-16 border-x border-stone-200 py-2 text-center text-sm font-semibold text-stone-900"
                                        />
                                        <button
                                            type="button"
                                            className="px-3 py-2 text-sm text-stone-500 hover:text-stone-900"
                                            onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-lg font-semibold text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                    <button type="button" onClick={clearCart} className="text-sm font-medium text-stone-400 hover:text-stone-600">
                        Vaciar carrito
                    </button>
                </div>

                <aside className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-stone-900">Resumen</h2>
                    <dl className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-stone-500">Subtotal</dt>
                            <dd className="font-semibold text-stone-900">${subtotal.toFixed(2)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-stone-500">Envío</dt>
                            <dd className="text-stone-400">Se calcula en el checkout</dd>
                        </div>
                    </dl>
                    <hr className="my-4 border-stone-100" />
                    <div className="flex items-center justify-between text-base font-semibold text-stone-900">
                        <span>Total estimado</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <Link
                        to="/checkout"
                        className="mt-6 flex w-full items-center justify-center rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                    >
                        Continuar al pago
                    </Link>
                </aside>
            </div>
        </section>
    );
}
