import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../../components/catalog/ProductCard.tsx';
import { mockProducts } from '../../data/products.ts';

function ProductDetailPage() {
  const { productId } = useParams();
  const product = mockProducts.find((item) => item.id === productId);

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }
    return mockProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  }, [product]);

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
          <div className="space-y-4 rounded-3xl bg-light/60 p-6">
            <p className="text-xl font-semibold text-text">Precio: ${product.price.toLocaleString('es-CO')}</p>
            <div className="flex flex-wrap gap-3 text-sm text-muted">
              <span className="rounded-full bg-white px-4 py-2">Pago seguro</span>
              <span className="rounded-full bg-white px-4 py-2">Envío nacional</span>
              <span className="rounded-full bg-white px-4 py-2">Cambios 7 días</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:opacity-90" type="button">
                Agregar al carrito
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

export default ProductDetailPage;
