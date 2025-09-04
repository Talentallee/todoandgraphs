/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

// --- опционально: анализ бандла при ANALYZE=true ---
let withAnalyzer = (cfg) => cfg; // заглушка по умолчанию
try {
  // подключим только если пакет установлен
  const bundleAnalyzer = require('@next/bundle-analyzer');
  withAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
} catch (_) {
  // пакета может не быть — игнорируем
}

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
];

// В dev оставляем 'unsafe-eval' для HMR, в prod — убираем
const csp = [
  "default-src 'self'",
  `script-src 'self'${isProd ? '' : " 'unsafe-eval'"} 'unsafe-inline'`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "font-src 'self' data:",
  "frame-ancestors 'none'",
].join('; ');

const nextConfig = {
  reactStrictMode: true,

  // Если ранее включал игнор линта на билде — можешь удалить этот блок.
  // eslint: { ignoreDuringBuilds: true },

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

module.exports = withAnalyzer(nextConfig);
