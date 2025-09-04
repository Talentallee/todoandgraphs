import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata = {
  title: 'План-график разработки',
  description: 'Интерактивный план-график проекта',
};

const THEME_BOOTSTRAP = `
!function(){
  try{
    var key='theme_v1';
    var saved = localStorage.getItem(key);
    var isDark = saved ? (saved === 'dark') : window.matchMedia('(prefers-color-scheme: dark)').matches;
    var root = document.documentElement;
    if(isDark) root.classList.add('dark'); else root.classList.remove('dark');
  }catch(e){}
}();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
      </head>
      <body className="min-h-screen antialiased bg-slate-50 dark:bg-slate-950">

        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
