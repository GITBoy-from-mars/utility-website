import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import { exec } from 'child_process';
import mammoth from 'mammoth';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { getUploadsDir } from '../../middleware/upload.js';

const router = Router();

// Check if LibreOffice is available
function checkLibreOffice() {
  return new Promise((resolve) => {
    exec('libreoffice --version', (err) => resolve(!err));
  });
}

// Convert using LibreOffice (preserves ALL formatting)
async function convertWithLibreOffice(inputPath) {
  const outDir = getUploadsDir();
  return new Promise((resolve, reject) => {
    const cmd = `libreoffice --headless --convert-to pdf --outdir "${outDir}" "${inputPath}"`;
    exec(cmd, { timeout: 60000 }, (err, stdout, stderr) => {
      if (err) return reject(err);
      const baseName = path.basename(inputPath, path.extname(inputPath));
      const pdfPath = path.join(outDir, `${baseName}.pdf`);
      if (fs.existsSync(pdfPath)) resolve(pdfPath);
      else reject(new Error('LibreOffice conversion produced no output'));
    });
  });
}

// Fallback: Convert using mammoth with improved formatting
async function convertWithMammoth(inputPath) {
  const buffer = fs.readFileSync(inputPath);
  const { value: html } = await mammoth.convertToHtml({ buffer });
  
  // Parse HTML for basic formatting
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  const margin = 50;
  const pageWidth = 595; // A4
  const pageHeight = 842;
  const maxTextWidth = pageWidth - margin * 2;
  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  // Strip HTML tags and split into logical blocks
  const blocks = html.split(/<\/?(?:p|h[1-6]|li|br|div)[^>]*>/gi).filter(b => b.trim());
  
  for (const block of blocks) {
    const cleanText = block.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').trim();
    if (!cleanText) continue;

    const isBold = /<strong|<b>/i.test(block);
    const isItalic = /<em|<i>/i.test(block);
    const isHeading = /<h[1-3]/i.test(block);
    
    const font = isBold ? fontBold : isItalic ? fontItalic : fontRegular;
    const fontSize = isHeading ? 16 : 11;
    const lineHeight = fontSize * 1.6;
    
    // Word wrap
    const words = cleanText.split(/\s+/);
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      if (testWidth > maxTextWidth && currentLine) {
        if (y < margin + lineHeight) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
        y -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      if (y < margin + lineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
      y -= lineHeight;
    }
    
    y -= lineHeight * 0.3; // paragraph spacing
  }

  return await pdfDoc.save();
}

router.post('/convert', upload.single('file'), async (req, res) => {
  try {
    const hasLO = await checkLibreOffice();
    
    if (hasLO) {
      const pdfPath = await convertWithLibreOffice(req.file.path);
      const pdfBuffer = fs.readFileSync(pdfPath);
      cleanupFile(req.file.path);
      cleanupFile(pdfPath);
      res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=converted.pdf' });
      return res.send(pdfBuffer);
    }

    // Fallback to mammoth
    const pdfBytes = await convertWithMammoth(req.file.path);
    cleanupFile(req.file.path);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=converted.pdf' });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    cleanupFile(req.file?.path);
    res.status(500).json({ error: 'Conversion failed: ' + err.message });
  }
});

export default router;
