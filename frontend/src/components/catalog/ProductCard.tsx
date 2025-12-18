import { Link } from 'react-router-dom';
import type { Product } from '../../data/products.ts';

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-primary/10">
      <Link className="relative block" to={`/catalogo/${product.id}`}>
        <img alt={product.name} className="h-48 w-full object-cover" src={product.image} />
        {product.status ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {product.status}
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">{product.brand}</p>
          <Link className="text-xl font-serif text-text hover:underline" to={`/catalogo/${product.id}`}>
            {product.name}
          </Link>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className="font-semibold text-text">${product.price.toLocaleString('es-CO')}</span>
          <span>·</span>
          <span>{product.rating.toFixed(1)} ⭐</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {product.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-light px-3 py-1 text-muted">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between text-sm">
          <span className={product.stock > 0 ? 'text-success' : 'text-error'}>
            {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
          </span>
          <button
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:opacity-90 disabled:opacity-40"
            disabled={product.stock === 0}
            type="button"
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
