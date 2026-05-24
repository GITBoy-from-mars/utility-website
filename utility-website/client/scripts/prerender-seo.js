/* ============================================================
   STATIC SEO PRE-RENDERER
   Generates physical, search-engine-crawlable HTML files for
   all tools, blogs, and static pages inside dist/.
   Run automatically after: npm run build
   ============================================================ */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_PATH = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.resolve(DIST_PATH, 'index.html');

const SITE_URL = 'https://utility-website-9xn.pages.dev';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

// Helper: Escape string for HTML attributes
function escapeHtmlAttr(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 1. Check for compiled index.html
if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('❌ Error: No dist/index.html found. Run vite build first.');
  process.exit(1);
}
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

// 2. Load Tools & Pre-render
const toolsDir = path.resolve(__dirname, '../src/tools');
const toolFolders = fs.readdirSync(toolsDir).filter((f) => {
  const metaPath = path.join(toolsDir, f, 'meta.js');
  return fs.existsSync(metaPath) && f !== '_registry.js';
});

console.log(`🚀 Starting SEO Pre-rendering for ${toolFolders.length} tools...`);

for (const folder of toolFolders) {
  const metaPath = path.join(toolsDir, folder, 'meta.js');
  const seoPath = path.join(toolsDir, folder, 'seo.js');

  const metaUrl = pathToFileURL(metaPath).href;
  const metaMod = await import(metaUrl);
  const meta = metaMod.default;

  let seo = {};
  if (fs.existsSync(seoPath)) {
    const seoUrl = pathToFileURL(seoPath).href;
    const seoMod = await import(seoUrl);
    seo = seoMod.default || {};
  }

  // Calculate SEO values (exactly mirroring client side)
  const seoTitle = seo.title || `${meta.name} - Free Online ${meta.name.includes('Tool') ? '' : 'Tool'} | UtiliTools`;
  const seoDesc = seo.description || `${meta.description}. Free, no sign-up required. Use ${meta.name} online with UtiliTools.`;
  const seoKeywords = seo.keywords || [
    ...(meta.keywords || []),
    'free online tool',
    'no signup',
    meta.name.toLowerCase(),
    `${meta.name.toLowerCase()} online`,
    `free ${meta.name.toLowerCase()}`,
  ].join(', ');
  const seoImage = seo.image || DEFAULT_OG_IMAGE;
  const canonicalUrl = `${SITE_URL}/tools/${meta.slug}`;

  // Generate Page HTML
  const customHtml = injectSEO(template, seoTitle, seoDesc, seoKeywords, canonicalUrl, seoImage);

  // Write to dist/tools/[slug]/index.html
  const pageDir = path.join(DIST_PATH, 'tools', meta.slug);
  fs.mkdirSync(pageDir, { recursive: true });
  fs.writeFileSync(path.join(pageDir, 'index.html'), customHtml, 'utf8');
}

console.log(`✅ Pre-rendered SEO for ${toolFolders.length} tools successfully.`);

// 3. Load Blog Posts & Pre-render
const blogPostsDir = path.resolve(__dirname, '../src/blog/posts');
if (fs.existsSync(blogPostsDir)) {
  const categories = fs.readdirSync(blogPostsDir).filter((f) => fs.statSync(path.join(blogPostsDir, f)).isDirectory());
  let blogCount = 0;

  for (const cat of categories) {
    const catDir = path.join(blogPostsDir, cat);
    const files = fs.readdirSync(catDir).filter((f) => f.endsWith('.html'));

    for (const file of files) {
      const slug = file.replace('.html', '');
      const filePath = path.join(catDir, file);
      const rawContent = fs.readFileSync(filePath, 'utf8');

      // Parse BLOG_META
      let meta = {};
      const metaMatch = rawContent.match(/<!--\s*BLOG_META\s*(\{[\s\S]*?\})\s*-->/);
      if (metaMatch) {
        try {
          meta = JSON.parse(metaMatch[1]);
        } catch (e) {
          console.warn('⚠️ Invalid blog meta in', filePath);
        }
      }

      const seoTitle = meta.title ? `${meta.title} | UtiliTools Blog` : `${slug.replace(/-/g, ' ')} | UtiliTools Blog`;
      const seoDesc = meta.description || meta.excerpt || 'Read the full article on the UtiliTools Blog.';
      const seoKeywords = meta.keywords || (meta.tags || []).join(', ');
      const seoImage = meta.image ? `${SITE_URL}${meta.image}` : DEFAULT_OG_IMAGE;
      const canonicalUrl = `${SITE_URL}/blog/${cat}/${slug}`;

      const customHtml = injectSEO(template, seoTitle, seoDesc, seoKeywords, canonicalUrl, seoImage);

      const pageDir = path.join(DIST_PATH, 'blog', cat, slug);
      fs.mkdirSync(pageDir, { recursive: true });
      fs.writeFileSync(path.join(pageDir, 'index.html'), customHtml, 'utf8');
      blogCount++;
    }
  }
  console.log(`✅ Pre-rendered SEO for ${blogCount} blog articles successfully.`);
}

// 4. Pre-render Static Pages
const staticPages = [
  { slug: 'about', title: 'About Us — Our Mission & Values', desc: 'Learn about UtiliTools — 100+ free online utility tools built with privacy and speed in mind. No sign-up required.' },
  { slug: 'contact', title: 'Contact Us — Get in Touch', desc: 'Have questions, feedback, or a partnership inquiry? Contact the UtiliTools team. We respond within 24-48 hours.' },
  { slug: 'privacy-policy', title: 'Privacy Policy', desc: 'Privacy policy for UtiliTools. Learn how we protect your data.' },
  { slug: 'data-storage', title: 'Data Storage Policy', desc: 'How UtiliTools handles your uploaded files and data.' },
  { slug: 'blog', title: 'UtiliTools Blog — Tutorials, Guides & Tips', desc: 'Read the latest tutorials, guides, and tips on how to use utility tools online to boost your productivity.' }
];

for (const page of staticPages) {
  const seoTitle = `${page.title} | UtiliTools`;
  const canonicalUrl = `${SITE_URL}/${page.slug}`;
  const customHtml = injectSEO(template, seoTitle, page.desc, 'utilitools, free tools, utility tools', canonicalUrl, DEFAULT_OG_IMAGE);

  const pageDir = path.join(DIST_PATH, page.slug);
  fs.mkdirSync(pageDir, { recursive: true });
  fs.writeFileSync(path.join(pageDir, 'index.html'), customHtml, 'utf8');
}
console.log(`✅ Pre-rendered SEO for ${staticPages.length} static pages successfully.`);
console.log('🎉 Static SEO Pre-rendering completed successfully!');

// HTML Ingestion & Replacement Engine
function injectSEO(html, title, description, keywords, canonical, image) {
  let output = html;

  const escTitle = escapeHtmlAttr(title);
  const escDesc = escapeHtmlAttr(description);
  const escKeywords = escapeHtmlAttr(keywords);
  const escCanonical = escapeHtmlAttr(canonical);
  const escImage = escapeHtmlAttr(image);

  // Replace Title
  output = output.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title data-rh="true">${title}</title>`);

  // Replace Meta Description
  output = output.replace(/<meta[^>]*?name="description"[^>]*?>/i, `<meta data-rh="true" name="description" content="${escDesc}" />`);

  // Replace Robots
  output = output.replace(/<meta[^>]*?name="robots"[^>]*?>/i, `<meta data-rh="true" name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />`);

  // Replace Canonical Link
  output = output.replace(/<link[^>]*?rel="canonical"[^>]*?>/i, `<link data-rh="true" rel="canonical" href="${escCanonical}" />`);

  // Open Graph
  output = output.replace(/<meta[^>]*?property="og:title"[^>]*?>/i, `<meta data-rh="true" property="og:title" content="${escTitle}" />`);
  output = output.replace(/<meta[^>]*?property="og:description"[^>]*?>/i, `<meta data-rh="true" property="og:description" content="${escDesc}" />`);
  output = output.replace(/<meta[^>]*?property="og:url"[^>]*?>/i, `<meta data-rh="true" property="og:url" content="${escCanonical}" />`);
  if (escImage) {
    output = output.replace(/<meta[^>]*?property="og:image"[^>]*?>/i, `<meta data-rh="true" property="og:image" content="${escImage}" />`);
    output = output.replace(/<meta[^>]*?property="og:image:alt"[^>]*?>/i, `<meta data-rh="true" property="og:image:alt" content="${escTitle}" />`);
  }

  // Twitter Card
  output = output.replace(/<meta[^>]*?name="twitter:title"[^>]*?>/i, `<meta data-rh="true" name="twitter:title" content="${escTitle}" />`);
  output = output.replace(/<meta[^>]*?name="twitter:description"[^>]*?>/i, `<meta data-rh="true" name="twitter:description" content="${escDesc}" />`);
  if (escImage) {
    output = output.replace(/<meta[^>]*?name="twitter:image"[^>]*?>/i, `<meta data-rh="true" name="twitter:image" content="${escImage}" />`);
  }

  // Keywords Injector
  if (escKeywords) {
    const keywordsMeta = `<meta data-rh="true" name="keywords" content="${escKeywords}" />`;
    if (output.match(/<meta[^>]*?name="keywords"[^>]*?>/i)) {
      output = output.replace(/<meta[^>]*?name="keywords"[^>]*?>/i, keywordsMeta);
    } else {
      // Inject keywords right after description
      output = output.replace(/(<meta[^>]*?name="description"[^>]*?>)/i, `$1\n    ${keywordsMeta}`);
    }
  }

  return output;
}
