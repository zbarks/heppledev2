// Builds an indexable static page per gift box from index.html, plus
// sitemap.xml and robots.txt. Run: node tools/build-seo.js
// Each page gets its own <title>, meta description, canonical URL, Open
// Graph tags, Product structured data and a static H1, then the normal
// site JS takes over and renders the full product page.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'seo/products.json'), 'utf8'));
const site = cfg.siteUrl.replace(/\/$/, '');
const base = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

fs.mkdirSync(path.join(root, 'shop'), { recursive: true });
for (const p of cfg.products) {
  const url = `${site}/shop/${p.slug}`;
  const images = p.images.map((i) => `${site}/${i}`);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: images,
    sku: p.sku,
    brand: { '@type': 'Brand', name: cfg.brand },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'GBP',
      price: p.price,
      availability: `https://schema.org/${p.availability}`,
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'GBP' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'GB' }
      }
    }
  };
  const head = `<base href="/" />
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}" />
<link rel="canonical" href="${url}" />
<meta name="robots" content="index, follow" />
<meta property="og:title" content="${esc(p.title)}" />
<meta property="og:description" content="${esc(p.description)}" />
<meta property="og:image" content="${images[0]}" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="product" />
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script>window.__HEPPLE_ROUTE__ = '/shop/${p.slug}';</script>`;
  let html = base
    .replace(/<title>[\s\S]*?<\/title>\n?/, '')
    .replace(/<meta name="description"[^>]*>\n?/, '')
    .replace(/<meta property="og:[^>]*>\n?/g, '')
    .replace('<meta charset="utf-8" />', `<meta charset="utf-8" />\n${head}`)
    .replace('<section class="product-detail" id="productDetail"></section>',
      `<section class="product-detail" id="productDetail"><div class="wrap"><h1>${esc(p.name)}</h1><p>${esc(p.description)}</p></div></section>`);
  fs.writeFileSync(path.join(root, 'shop', `${p.slug}.html`), html);
  console.log('built shop/' + p.slug + '.html');
}

const today = new Date().toISOString().slice(0, 10);
const urls = [`${site}/`].concat(cfg.products.map((p) => `${site}/shop/${p.slug}`));
fs.writeFileSync(path.join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') + `\n</urlset>\n`);
fs.writeFileSync(path.join(root, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site}/sitemap.xml\n`);
console.log('built sitemap.xml + robots.txt');
