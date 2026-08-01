export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">{eyebrow}</p>
      <h1 className="mt-2 font-serif text-4xl font-bold text-ink-900 sm:text-5xl">{title}</h1>
      {description && <p className="mt-4 text-lg leading-relaxed text-ink-500">{description}</p>}
    </header>
  );
}
