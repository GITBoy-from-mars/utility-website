import { Router } from 'express';
const router = Router();

async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; UtiliTools/1.0)' },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });
    return { url, status: res.status };
  } catch {
    // Retry with GET for servers that block HEAD
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; UtiliTools/1.0)' },
        redirect: 'follow',
        signal: AbortSignal.timeout(8000),
      });
      return { url, status: res.status };
    } catch {
      return { url, status: 0 };
    }
  }
}

router.post('/check', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL required' });
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;

    // Fetch page HTML
    const response = await fetch(fullUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; UtiliTools/1.0)' },
      signal: AbortSignal.timeout(15000),
    });
    const html = await response.text();

    // Extract all links
    const linkRegex = /href=["']([^"'#]+?)["']/gi;
    const found = new Set();
    let m;
    while ((m = linkRegex.exec(html)) !== null) {
      let link = m[1].trim();
      if (link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('javascript:')) continue;
      if (link.startsWith('//')) link = 'https:' + link;
      else if (link.startsWith('/')) {
        try { const u = new URL(fullUrl); link = u.origin + link; } catch { continue; }
      } else if (!link.startsWith('http')) {
        try { link = new URL(link, fullUrl).href; } catch { continue; }
      }
      found.add(link);
    }

    // Check links in parallel (max 20 concurrent)
    const urls = [...found].slice(0, 100); // Limit to 100 links
    const batchSize = 20;
    const results = [];
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(checkUrl));
      results.push(...batchResults);
    }

    res.json({ url: fullUrl, links: results });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
