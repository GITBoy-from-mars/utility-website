/* ============================================================
   AUTO SITEMAP GENERATOR
   Generates sitemap.xml from tool registry + static pages + blog
   Run: node scripts/generate-sitemap.js
   ============================================================ */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://utility-website-9xn.pages.dev';

// 1. Static pages
const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/about', priority: '0.7', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
  { loc: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { loc: '/data-storage', priority: '0.5', changefreq: 'yearly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
];

// 2. Auto-discover tools from meta.js files
const toolsDir = path.join(__dirname, '..', 'src', 'tools');
const toolFolders = fs.readdirSync(toolsDir).filter(f => {
  const metaPath = path.join(toolsDir, f, 'meta.js');
  return fs.existsSync(metaPath) && f !== '_registry.js';
});

const toolUrls = [];
for (const folder of toolFolders) {
  const metaPath = path.join(toolsDir, folder, 'meta.js');
  const content = fs.readFileSync(metaPath, 'utf8');
  const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/);
  if (slugMatch) {
    toolUrls.push({ loc: `/tools/${slugMatch[1]}`, priority: '0.8', changefreq: 'monthly' });
  }
}

// 3. Auto-discover blog posts
const blogDir = path.join(__dirname, '..', 'src', 'blog', 'posts');
const blogUrls = [];
if (fs.existsSync(blogDir)) {
  const categories = fs.readdirSync(blogDir).filter(f => fs.statSync(path.join(blogDir, f)).isDirectory());
  for (const cat of categories) {
    const catDir = path.join(blogDir, cat);
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.html'));
    for (const file of files) {
      const slug = file.replace('.html', '');
      blogUrls.push({ loc: `/blog/${cat}/${slug}`, priority: '0.6', changefreq: 'monthly' });
    }
  }
}

// Build XML
const today = new Date().toISOString().split('T')[0];
const allUrls = [...staticPages, ...toolUrls, ...blogUrls];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
for (const u of allUrls) {
  xml += `  <url>\n`;
  xml += `    <loc>${BASE}${u.loc}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
  xml += `    <priority>${u.priority}</priority>\n`;
  xml += `  </url>\n`;
}
xml += `</urlset>\n`;

const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log(`✅ Sitemap generated: ${allUrls.length} URLs → public/sitemap.xml`);
console.log(`   - ${staticPages.length} static pages`);
console.log(`   - ${toolUrls.length} tools`);
console.log(`   - ${blogUrls.length} blog posts`);
