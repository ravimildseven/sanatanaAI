import PDFDocument from 'pdfkit';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const doc = new PDFDocument();
const outputPath = join(__dirname, '..', 'public', 'ebooks', 'sample-ebook.pdf');
doc.pipe(fs.createWriteStream(outputPath));

doc.fontSize(25)
   .text('साधना संग्रह', { align: 'center' });

doc.moveDown();
doc.fontSize(16)
   .text('॥ श्री गणेशाय नमः ॥', { align: 'center' });

doc.moveDown();
doc.fontSize(14)
   .text('अथ प्रथमोऽध्यायः', { align: 'left' });

doc.moveDown();
doc.fontSize(12)
   .text('यद्वाचो निःसृतं शास्त्रं यद्वाचः श्रुतिसम्मतम्।\nतद्वाचो गुरुमूलं हि तस्मै श्रीगुरवे नमः॥\n\n', { align: 'left' });

doc.end();
