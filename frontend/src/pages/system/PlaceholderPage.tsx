type PlaceholderPageProps = {
  title: string;
  description: string;
  badge?: string;
};

function PlaceholderPage({ title, description, badge }: PlaceholderPageProps) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      {badge ? (
        <span className="inline-flex items-center rounded-full bg-secondary/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          {badge}
        </span>
      ) : null}
      <div className="space-y-4">
        <h1>{title}</h1>
        <p className="max-w-xl text-lg text-muted">{description}</p>
      </div>
      <div className="rounded-2xl border border-dashed border-muted/60 px-6 py-4 text-sm text-muted">
        Esta vista se completará en las siguientes tareas de la fase 3.
      </div>
    </section>
  );
}

export default PlaceholderPage;
