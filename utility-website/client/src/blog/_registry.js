/* ============================================================
   BLOG REGISTRY — Auto-discovers blog posts from folders
   
   To add a new blog post:
   1. Create/use a category folder: src/blog/posts/converters/
   2. Add an HTML file: my-post.html
   3. Include meta comment at top of HTML: <!-- BLOG_META {"title":"...","excerpt":"...","date":"2026-05-15","image":"/blog-images/my-post.jpg","author":"Admin"} -->
   4. Done! It auto-appears on the blog.
   ============================================================ */

// Import all HTML blog files from posts subdirectories
const blogModules = import.meta.glob('./posts/**/*.html', { query: '?raw', import: 'default', eager: true });

const posts = [];

Object.entries(blogModules).forEach(([path, rawContent]) => {
  // Extract: ./posts/category-folder/filename.html
  const parts = path.replace('./posts/', '').split('/');
  if (parts.length < 2) return;
  
  const categoryFolder = parts[0]; // e.g. "converters", "compressors"
  const filename = parts.slice(1).join('/').replace('.html', '');
  const slug = filename.replace(/\s+/g, '-').toLowerCase();

  // Parse meta from HTML comment: <!-- BLOG_META {...} -->
  let meta = {};
  const metaMatch = rawContent.match(/<!--\s*BLOG_META\s*(\{[\s\S]*?\})\s*-->/);
  if (metaMatch) {
    try { meta = JSON.parse(metaMatch[1]); } catch (e) { console.warn('Invalid blog meta in', path); }
  }

  // Clean HTML content (remove meta comment)
  const content = rawContent.replace(/<!--\s*BLOG_META\s*\{[\s\S]*?\}\s*-->/, '').trim();

  // Category name from folder name
  const categoryName = categoryFolder
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  posts.push({
    slug,
    category: categoryFolder,
    categoryName,
    title: meta.title || filename.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    excerpt: meta.excerpt || content.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
    description: meta.description || meta.excerpt || content.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
    date: meta.date || '2026-01-01',
    author: meta.author || 'Admin',
    image: meta.image || null,
    tags: meta.tags || [],
    keywords: meta.keywords || '',
    focusKeyword: meta.focusKeyword || '',
    content,
    path: `/blog/${categoryFolder}/${slug}`,
  });
});

// Sort by date descending (newest first)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

export const getAllPosts = () => posts;

export const getPostBySlug = (category, slug) =>
  posts.find(p => p.category === category && p.slug === slug);

export const getPostsByCategory = (category) =>
  posts.filter(p => p.category === category);

export const getAllCategories = () => {
  const cats = {};
  posts.forEach(p => {
    if (!cats[p.category]) cats[p.category] = { id: p.category, name: p.categoryName, count: 0 };
    cats[p.category].count++;
  });
  return Object.values(cats);
};

export const getRecentPosts = (limit = 6) => posts.slice(0, limit);

export default posts;
