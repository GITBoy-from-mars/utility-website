import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function autoLoadToolRoutes(app) {
  const toolsDir = __dirname;
  const entries = fs.readdirSync(toolsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('_')) continue;
    const routePath = path.join(toolsDir, entry.name, 'routes.js');
    if (!fs.existsSync(routePath)) continue;

    try {
      const routeModule = await import(`file://${routePath.replace(/\\/g, '/')}`);
      const router = routeModule.default;
      const mountPath = `/api/tools/${entry.name}`;
      app.use(mountPath, router);
      console.log(`  Loaded: ${mountPath}`);
    } catch (err) {
      console.error(`  Failed to load ${entry.name}/routes.js:`, err.message);
    }
  }
  console.log('All tool routes loaded.\n');
}
