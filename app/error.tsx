'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] grid place-items-center text-center p-8">
      <div>
        <h1 className="text-3xl font-bold text-red-600">Упс, что-то пошло не так</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{error.message}</p>
        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
