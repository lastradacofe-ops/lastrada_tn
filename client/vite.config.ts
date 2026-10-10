import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const rawPort = process.env.PORT || '5173';

if (!rawPort) {
  throw new Error(
    'PORT environment variable is required but was not provided.',
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || '/';

// Vercel provides its stable production hostname to both production and
// preview builds. Other hosts can set VITE_SITE_URL to their public URL.
const configuredSiteUrl = process.env.VITE_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : '');
const siteUrl = configuredSiteUrl ? new URL(configuredSiteUrl).origin : '';

function localSeoPlugin() {
  return {
    name: 'lastrada-local-seo',
    transformIndexHtml(html: string) {
      const canonicalTags = siteUrl
        ? `<link rel="canonical" href="${siteUrl}/" />\n    <meta property="og:url" content="${siteUrl}/" />\n    <meta property="og:image" content="${siteUrl}/lastrada-interior.jpg" />\n    <meta name="twitter:image" content="${siteUrl}/lastrada-interior.jpg" />`
        : '';
      const structuredData = siteUrl
        ? `<script type="application/ld+json">${JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CafeOrCoffeeShop',
            name: 'LASTRADA Café-Resto',
            url: `${siteUrl}/`,
            image: `${siteUrl}/lastrada-interior.jpg`,
            telephone: '+21651524107',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'LASTRADA20 P2',
              addressLocality: 'Kairouan',
              postalCode: '3100',
              addressRegion: 'Kairouan Governorate',
              addressCountry: 'TN',
            },
            hasMap: 'https://maps.app.goo.gl/nen9bnFSdq4LyJB98',
            openingHours: 'Mo-Su 06:00-01:00',
            sameAs: [
              'https://www.facebook.com/Lastrada24/',
              'https://www.instagram.com/lastrada_lounge/',
            ],
          })}</script>`
        : '';

      return html
        .replace('<!-- SEO_CANONICAL -->', canonicalTags)
        .replace('<!-- SEO_STRUCTURED_DATA -->', structuredData);
    },
    generateBundle() {
      if (!siteUrl) return;
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}/</loc></url></urlset>\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
    },
  };
}

if (!basePath) {
  throw new Error(
    'BASE_PATH environment variable is required but was not provided.',
  );
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    localSeoPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/api': {
        target: process.env.API_ORIGIN || 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
