export default function NotFound() {
    return (
      <div className="min-h-[60vh] grid place-items-center text-center p-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Страница не найдена</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Проверь адрес или вернись на главную.</p>
          <a href="/" className="inline-block mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500">
            На главную
          </a>
        </div>
      </div>
    );
  }
  