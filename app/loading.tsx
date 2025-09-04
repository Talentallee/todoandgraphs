export default function Loading() {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-40 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="h-24 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        </div>
      </main>
    );
  }
  