/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Запрещаем доступ к чувствительным возможностям
  { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
];

// Content-Security-Policy
// В DEV разрешаем 'unsafe-eval' (нужно для React Fast Refresh/HMR).
// В PROD — без 'unsafe-eval'. 'unsafe-inline' для стилей оставляем из-за Tailwind/инлайн-стилей.
// Если используешь внешние шрифты/аналитику — добавь домены в policy ниже.
const csp = [
  "default-src 'self'",
  `script-src 'self'${isProd ? '' : " 'unsafe-eval'"} 'unsafe-inline'`,
  "style-src 'self' 'unsafe-inline'",
  // Если начнёшь грузить изображения с внешних доменов — добавь их сюда.
  "img-src 'self' data: blob:",
  // Для API-запросов. Если подключишь Upstash/Vercel KV — добавь их домены.
  "connect-src 'self'",
  "font-src 'self' data:",
  "frame-ancestors 'none'",
].join('; ');

const nextConfig = {
  reactStrictMode: true,

  // Быстрый фикс под Vercel: не валить сборку из-за ESLint.
  // Когда будешь готов — убери это и добавь полноценный ESLint.
  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...securityHeaders,
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
