const highlights = [
  'Catálogo curado de marcas locales',
  'Checkout seguro para compradoras',
  'Panel de control para vendedoras y admins',
];

function HomePage() {
  return (
    <div className="mx-auto flex h-full min-h-screen flex-col items-center justify-center px-6 py-16 lg:flex-row lg:gap-16">
      <div className="max-w-xl space-y-6 text-center lg:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Juliana’s Marketplace</p>
        <h1>Frontend Core listo para despegar</h1>
        <p className="text-lg text-muted">
          Este proyecto React + Tailwind será la base visual del marketplace multivendedor.
          Desde aquí construiremos la experiencia de compradoras, vendedoras y administradoras.
        </p>
        <ul className="space-y-3">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-3 text-base text-text">
              <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button className="bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90" type="button">
            Explorar tareas
          </button>
          <button
            className="rounded-xl border border-muted px-6 py-3 font-semibold text-text transition hover:border-primary hover:text-primary"
            type="button"
          >
            Ver documentación
          </button>
        </div>
      </div>

      <div className="mt-12 w-full max-w-sm rounded-3xl bg-white p-8 shadow-lg lg:mt-0">
        <p className="text-sm font-semibold text-primary">Estado del proyecto</p>
        <p className="mt-2 text-3xl font-serif font-bold text-text">Fase 3 · Frontend Core</p>
        <p className="mt-4 text-muted">
          Stack configurado con React + TypeScript + Tailwind. Continuaremos con routing, layout y vistas críticas.
        </p>
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Setup inicial</span>
            <span className="font-semibold text-success">Completado</span>
          </div>
          <div className="h-2 rounded-full bg-light">
            <div className="h-full rounded-full bg-primary" style={{ width: '25%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
