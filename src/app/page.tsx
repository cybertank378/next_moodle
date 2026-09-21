export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-3xl rounded-2xl border border-border bg-surface p-8 shadow-card md:p-12">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Foundation Bootstrap Active
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Moodle Exam SaaS Platform
        </h1>

        <p className="mt-3 text-base text-muted-foreground">
          Fondasi Next.js dengan TypeScript Strict, Tailwind CSS Custom UI,
          Biome, dan Vitest siap dikembangkan.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-background/50 p-4 transition hover:border-primary/40">
            <h2 className="text-sm font-semibold text-foreground">
              🛡️ TypeScript Strict
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Strict type-checking aktif dengan alias path{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono">
                @/*
              </code>
              .
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/50 p-4 transition hover:border-primary/40">
            <h2 className="text-sm font-semibold text-foreground">
              🎨 Custom Design System
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Tailwind CSS dengan semantic tokens & komponen mandiri tanpa
              dependensi eksternal.
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/50 p-4 transition hover:border-primary/40">
            <h2 className="text-sm font-semibold text-foreground">
              ⚡ Biome & Vitest
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Linter & formatter secepat kilat serta automated test runner
              standar TDD.
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/50 p-4 transition hover:border-primary/40">
            <h2 className="text-sm font-semibold text-foreground">
              🏢 Clean Hexagonal Architecture
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Scaffolding folder siap untuk multi-tenant SaaS dan integrasi
              Moodle.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
          <span>Version 0.1.0 (Issue 01 Baseline)</span>
          <span className="font-mono text-success font-medium">Ready</span>
        </div>
      </div>
    </main>
  );
}
