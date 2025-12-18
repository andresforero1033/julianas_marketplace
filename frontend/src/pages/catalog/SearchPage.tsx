import { useMemo } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/catalog/ProductCard.tsx';
import { mockProducts } from '../../data/products.ts';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return [];
    }

    return mockProducts.filter((product) => {
      const target = `${product.name} ${product.brand} ${product.tags.join(' ')}`.toLowerCase();
      return target.includes(normalized);
    });
  }, [query]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextQuery = (formData.get('search') as string) ?? '';

    setSearchParams(nextQuery ? { q: nextQuery } : {});
  };

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-white/80 p-6 shadow-lg shadow-secondary/10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Búsqueda avanzada</p>
        <h1 className="mt-2 text-4xl font-serif text-text">Encuentra productos por nombre, marca o etiquetas</h1>
        <form className="mt-6 flex flex-col gap-3 md:flex-row" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="search-input">
            Buscar productos
          </label>
          <input
            className="flex-1 rounded-2xl border border-muted/40 px-4 py-3 text-base text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            defaultValue={query}
            id="search-input"
            name="search"
            placeholder="Ej: kimono, skincare vegano, bolso"
            type="search"
          />
          <button className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:opacity-90" type="submit">
            Buscar
          </button>
        </form>
      </header>

      {query.trim().length === 0 ? (
        <div className="rounded-3xl border border-dashed border-muted/50 p-10 text-center">
          <p className="text-2xl font-serif text-text">Ingresa un término para empezar</p>
          <p className="mt-2 text-muted">Puedes buscar por marca, categoría, materiales o cualquier palabra clave.</p>
        </div>
      ) : (
        <section className="space-y-6">
          <div className="flex flex-col gap-1 text-sm text-muted">
            <p>
              Resultados para <span className="font-semibold text-text">“{query}”</span>
            </p>
            <p>
              {filteredProducts.length > 0 ? `${filteredProducts.length} coincidencias` : 'Sin coincidencias'} · Fuente: datos mock para UI
            </p>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-muted/60 p-10 text-center">
              <p className="text-2xl font-serif text-text">No encontramos resultados</p>
              <p className="mt-2 text-muted">Prueba con otro término o revisa la ortografía.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default SearchPage;
