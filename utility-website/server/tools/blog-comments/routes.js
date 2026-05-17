import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMMENTS_DIR = path.join(__dirname, '..', 'data', 'comments');
const router = express.Router();

// Ensure directory exists
if (!fs.existsSync(COMMENTS_DIR)) fs.mkdirSync(COMMENTS_DIR, { recursive: true });

const getFile = (category, slug) => path.join(COMMENTS_DIR, `${category}__${slug}.json`);

const readComments = (category, slug) => {
  const file = getFile(category, slug);
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
};

const writeComments = (category, slug, comments) => {
  fs.writeFileSync(getFile(category, slug), JSON.stringify(comments, null, 2), 'utf8');
};

// GET comments for a post
router.get('/:category/:slug', (req, res) => {
  const { category, slug } = req.params;
  const comments = readComments(category, slug);
  res.json({ success: true, comments });
});

// POST new comment
router.post('/:category/:slug', (req, res) => {
  const { category, slug } = req.params;
  const { name, email, text } = req.body;
  if (!name || !email || !text) return res.status(400).json({ success: false, error: 'Name, email, and comment are required' });

  const comments = readComments(category, slug);
  const comment = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: name.trim(),
    email: email.trim(),
    text: text.trim(),
    date: new Date().toISOString(),
  };
  comments.push(comment);
  writeComments(category, slug, comments);
  res.json({ success: true, comment });
});

export default router;
