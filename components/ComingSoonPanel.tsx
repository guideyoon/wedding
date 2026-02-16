interface ComingSoonPanelProps {
  title: string;
  description: string;
}

export function ComingSoonPanel({ title, description }: ComingSoonPanelProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-[960px] items-center px-4 py-12 md:px-6">
      <section className="w-full rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-8 shadow-[var(--shadow-soft)]">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--ink-faint)]">Coming Soon</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink-strong)]">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-dim)]">{description}</p>
      </section>
    </main>
  );
}

