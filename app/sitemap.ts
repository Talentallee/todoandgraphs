import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://your-project.vercel.app';
  return [{ url: `${base}/`, lastModified: new Date() }];
}
