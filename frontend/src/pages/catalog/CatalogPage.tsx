import { useMemo, useState, type ChangeEvent } from 'react';
import ProductCard from '../../components/catalog/ProductCard.tsx';
import { mockProducts, productCategories, productTags } from '../../data/products.ts';

const availabilityFilters = [
  { value: 'all', label: 'Todo el inventario' },
  { value: 'in-stock', label: 'Disponible (stock &gt; 0)' },
] as const;

type Availability = (typeof availabilityFilters)[number]['value'];

type PriceRange = {
  min: number;
  max: number;
};

const initialPriceRange: PriceRange = { min: 0, max: 500000 };

function CatalogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<(typeof productCategories)[number]>('todos');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Availability>('all');
  const [priceRange, setPriceRange] = useState<PriceRange>(initialPriceRange);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || product.brand.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'todos' || product.category === category;
      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => product.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()));
      const matchesAvailability = availability === 'all' || product.stock > 0;
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;

      return matchesSearch && matchesCategory && matchesTags && matchesAvailability && matchesPrice;
    });
  }, [availability, category, priceRange.max, priceRange.min, search, selectedTags]);

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const parsed = Number(value) || 0;

    setPriceRange((prev) => ({
      ...prev,
      [name]: parsed,
    }));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('todos');
    setSelectedTags([]);
    setAvailability('all');
    setPriceRange(initialPriceRange);
  };

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-white/80 p-6 shadow-lg shadow-secondary/10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Explora el marketplace</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-serif text-text">Catálogo curado</h1>
            <p className="text-sm text-muted">Filtra por categoría, disponibilidad o etiquetas para descubrir marcas independientes.</p>
          </div>
          <div className="text-sm text-muted">
            <p>
              Mostrando <span className="font-semibold text-text">{filteredProducts.length}</span> de {mockProducts.length} productos
            </p>
            {selectedTags.length > 0 ? <p className="text-xs">Filtros activos: {selectedTags.join(', ')}</p> : null}
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-6 rounded-3xl bg-white/90 p-6 shadow-lg shadow-primary/5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Filtros</p>
            <button className="text-xs font-semibold text-muted underline" onClick={resetFilters} type="button">
              Limpiar
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-text" htmlFor="catalog-search">
              Búsqueda
            </label>
            <input
              className="w-full rounded-2xl border border-muted/40 px-4 py-2 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              id="catalog-search"
              placeholder="Vestidos, skincare, accesorios..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-text">Categorías</p>
            <div className="flex flex-wrap gap-2">
              {productCategories.map((item) => (
                <button
                  key={item}
                  className={[
                    'rounded-full border px-4 py-1 text-sm font-semibold transition',
                    category === item ? 'border-primary bg-primary/10 text-primary' : 'border-muted/40 text-muted hover:text-text',
                  ].join(' ')}
                  type="button"
                  onClick={() => setCategory(item)}
                >
                  {item === 'todos' ? 'Todo' : item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-text">Precio (COP)</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-muted" htmlFor="price-min">
                  Mínimo
                </label>
                <input
                  className="w-full rounded-2xl border border-muted/40 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                  id="price-min"
                  min={0}
                  name="min"
                  type="number"
                  value={priceRange.min}
                  onChange={handlePriceChange}
                />
              </div>
              <div>
                <label className="text-xs text-muted" htmlFor="price-max">
                  Máximo
                </label>
                <input
                  className="w-full rounded-2xl border border-muted/40 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                  id="price-max"
                  min={priceRange.min}
                  name="max"
                  type="number"
                  value={priceRange.max}
                  onChange={handlePriceChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-text">Disponibilidad</p>
            <div className="space-y-2">
              {availabilityFilters.map((option) => (
                <label key={option.value} className="flex items-center gap-3 text-sm text-text">
                  <input
                    checked={availability === option.value}
                    className="text-primary focus:ring-primary/30"
                    name="availability"
                    type="radio"
                    value={option.value}
                    onChange={(event) => setAvailability(event.target.value as Availability)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-text">Etiquetas</p>
            <div className="flex flex-wrap gap-2">
              {productTags.map((tag) => {
                const isActive = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    className={[
                      'rounded-full px-4 py-1 text-sm transition',
                      isActive ? 'bg-text text-white' : 'bg-light text-text hover:bg-light/70',
                    ].join(' ')}
                    onClick={() => handleTagToggle(tag)}
                    type="button"
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-muted/60 p-10 text-center">
              <p className="text-2xl font-serif text-text">No encontramos productos con esos filtros</p>
              <p className="mt-2 text-muted">Ajusta la búsqueda o combina menos etiquetas para descubrir nuevas marcas.</p>
            </div>
          ) : null}

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
export default CatalogPage;
