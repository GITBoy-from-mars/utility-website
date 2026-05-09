import { Router } from 'express';
const router = Router();
router.post('/extract', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL required' });
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    const response = await fetch(fullUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; UtiliTools/1.0)' },
      signal: AbortSignal.timeout(10000),
    });
    const html = await response.text();
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    // Extract meta tags
    const metaRegex = /<meta\s+([^>]+?)\/?>/gi;
    const tags = [];
    let m;
    while ((m = metaRegex.exec(html)) !== null) {
      const attrs = m[1];
      const tag = {};
      const attrRegex = /(\w[\w-]*)=["']([^"']*?)["']/g;
      let a;
      while ((a = attrRegex.exec(attrs)) !== null) {
        tag[a[1].toLowerCase()] = a[2];
      }
      if (Object.keys(tag).length > 0) tags.push(tag);
    }
    // Extract description
    const descTag = tags.find(t => t.name === 'description' || t.property === 'og:description');
    const description = descTag ? descTag.content : '';
    res.json({ title, description, tags, url: fullUrl });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
export default router;
