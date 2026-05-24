/* ============================================================
   TOOL REGISTRY — Auto-discovers all tools via import.meta.glob
   
   To add a new tool:
   1. Create folder: src/tools/your-tool-name/
   2. Add meta.js with tool metadata
   3. Add YourComponent.jsx
   4. Done! It auto-appears everywhere.
   ============================================================ */

const metaModules = import.meta.glob('./*/meta.js', { eager: true });
const componentModules = import.meta.glob('./*/index.jsx', { eager: true });
const seoModules = import.meta.glob('./*/seo.js', { eager: true });

const tools = [];

Object.entries(metaModules).forEach(([path, mod]) => {
  const folderName = path.split('/')[1];
  const meta = mod.default;
  
  const compPath = `./${folderName}/index.jsx`;
  const compMod = componentModules[compPath];
  const seoPath = `./${folderName}/seo.js`;
  const seoMod = seoModules[seoPath];
  
  if (meta && compMod) {
    tools.push({
      ...meta,
      seo: seoMod?.default || null,
      component: compMod.default,
      path: `/tools/${meta.slug}`,
    });
  }
});

/* Sort alphabetically within each category */
tools.sort((a, b) => a.name.localeCompare(b.name));

export const getToolsByCategory = (categoryId) =>
  tools.filter((t) => t.category === categoryId);

export const getToolBySlug = (slug) =>
  tools.find((t) => t.slug === slug);

export const getAllTools = () => tools;

export const searchTools = (query) => {
  const q = query.toLowerCase().trim();
  if (!q) return tools;
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.keywords && t.keywords.some((k) => k.toLowerCase().includes(q)))
  );
};

export default tools;
