import express from 'express';
import cors from 'cors';
import { autoLoadToolRoutes } from './tools/_autoLoader.js';
import { errorHandler } from './middleware/errorHandler.js';
import { startCleanupScheduler } from './middleware/cleanup.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Auto-load all tool routes
autoLoadToolRoutes(app);

/* Health check */
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

/* Error handler */
app.use(errorHandler);

/* Start cleanup scheduler (deletes uploads older than 10 min) */
startCleanupScheduler(path.join(__dirname, 'uploads'), 10);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
