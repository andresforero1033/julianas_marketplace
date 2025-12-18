import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../../components/catalog/ProductCard.tsx';
import { mockProducts } from '../../data/products.ts';
import { useCart } from '../../hooks/useCart.ts';
import { createDefaultVariantSelection, variantPriceAdjustment, variantStock, type VariantSelectionMap } from '../../utils/productVariants.ts';

function ProductDetailPageContent({ productId }: { productId?: string }) {
  const product = mockProducts.find((item) => item.id === productId);
  const [selectedVariants, setSelectedVariants] = useState<VariantSelectionMap>(() => createDefaultVariantSelection(product));
  const { addItem } = useCart();

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }
    return mockProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  }, [product]);

  const selectionSummary = useMemo(() => {
    if (!product?.variants) {
      return 'Única presentación';
    }
    return product.variants
      .map((group) => {
        const option = group.options.find((item) => item.id === selectedVariants[group.id]);
        return `${group.name}: ${option?.label ?? 'sin elegir'}`;
      })
      .join(' · ');
  }, [product, selectedVariants]);
  const priceModifier = product ? variantPriceAdjustment(product, selectedVariants) : 0;
  const finalPrice = product ? product.price + priceModifier : 0;
  const stockForSelection = product ? variantStock(product, selectedVariants) : 0;
  const canAddToCart = Boolean(product && stockForSelection > 0);

  const handleAddToCart = () => {
    if (!product) {
      return;
    }
    addItem({ product, selection: selectedVariants });
  };

  if (!product) {
    return (
      <div className="rounded-3xl border border-dashed border-muted/60 p-12 text-center">
        <p className="text-2xl font-serif text-text">No encontramos este producto</p>
        <p className="mt-2 text-muted">Verifica la URL o regresa al catálogo para seguir explorando.</p>
        <Link className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white" to="/catalogo">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
          <img alt={product.name} className="h-full w-full object-cover" src={product.image} />
        </div>
        <div className="space-y-6 rounded-3xl bg-white/80 p-8 shadow-lg shadow-primary/10">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{product.brand}</p>
            <h1 className="text-4xl font-serif text-text">{product.name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted">
              <span>{product.rating.toFixed(1)} ⭐</span>
              <span>·</span>
              <span className={product.stock > 0 ? 'text-success' : 'text-error'}>
                {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Agotado'}
              </span>
            </div>
          </div>
          <p className="text-lg text-muted">
            Este es un mock de descripción. Aquí contaremos la historia del producto, materiales, origen y recomendaciones de uso para reforzar la narrativa de marca.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {product.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-light px-3 py-1 text-muted">
                {tag}
              </span>
            ))}
          </div>
          {product.variants ? (
            <div className="space-y-4 rounded-3xl border border-light bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Selecciona variantes</p>
              {product.variants.map((group) => (
                <div key={group.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-text">{group.name}</p>
                    <span className="text-xs text-muted">
                      {selectedVariants[group.id]
                        ? group.options.find((option) => option.id === selectedVariants[group.id])?.stock ?? 0
                        : 0}{' '}
                      en stock
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((option) => {
                      const isSelected = selectedVariants[group.id] === option.id;
                      const isDisabled = option.stock === 0;
                      const classes = [
                        'rounded-full border px-4 py-2 text-sm font-semibold transition',
                        isSelected ? 'border-text bg-text text-white' : 'border-muted/40 text-text hover:border-primary',
                        isDisabled ? 'cursor-not-allowed opacity-40 hover:border-muted/40' : '',
                      ].join(' ');
                      return (
                        <button
                          key={option.id}
                          className={classes}
                          disabled={isDisabled}
                          type="button"
                          onClick={() =>
                            setSelectedVariants((prev) => ({
                              ...prev,
                              [group.id]: option.id,
                            }))
                          }
                        >
                          {option.label}
                          {option.priceModifier ? ` · +$${option.priceModifier.toLocaleString('es-CO')}` : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="rounded-2xl bg-light/60 p-4 text-sm text-muted">
                <p>
                    Selección actual: {selectionSummary}
                </p>
                <p className="mt-1">
                  {stockForSelection > 0
                    ? `${stockForSelection} unidades disponibles para esta combinación`
                    : 'Sin stock disponible para esta combinación'}
                </p>
              </div>
            </div>
          ) : null}
          <div className="space-y-4 rounded-3xl bg-light/60 p-6">
            <div>
              <p className="text-sm text-muted">Precio final con variantes</p>
              <p className="text-2xl font-semibold text-text">${finalPrice.toLocaleString('es-CO')}</p>
              {priceModifier !== 0 ? (
                <p className="text-xs text-muted">
                  Base ${product.price.toLocaleString('es-CO')} · Ajustes ${priceModifier > 0 ? '+' : ''}
                  ${priceModifier.toLocaleString('es-CO')}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted">
              <span className="rounded-full bg-white px-4 py-2">Pago seguro</span>
              <span className="rounded-full bg-white px-4 py-2">Envío nacional</span>
              <span className="rounded-full bg-white px-4 py-2">Cambios 7 días</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:opacity-90 disabled:opacity-40"
                disabled={!canAddToCart}
                type="button"
                onClick={handleAddToCart}
              >
                {canAddToCart ? 'Agregar al carrito' : 'Sin stock'}
              </button>
              <button className="rounded-full border border-muted px-6 py-3 text-sm font-semibold text-text hover:border-primary hover:text-primary" type="button">
                Guardar
              </button>
            </div>
          </div>
          <div className="text-sm text-muted">
            <p>Compartir:</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <button className="rounded-full bg-white px-4 py-2" type="button">
                Instagram
              </button>
              <button className="rounded-full bg-white px-4 py-2" type="button">
                WhatsApp
              </button>
              <button className="rounded-full bg-white px-4 py-2" type="button">
                Copiar link
              </button>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Sigue explorando</p>
              <h2 className="text-2xl font-serif text-text">Productos relacionados</h2>
            </div>
            <Link className="text-sm font-semibold text-primary hover:underline" to="/catalogo">
              Ver todo el catálogo
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ProductDetailPage() {
  const { productId } = useParams();
  return <ProductDetailPageContent key={productId ?? 'detail'} productId={productId} />;
}

export default ProductDetailPage;
