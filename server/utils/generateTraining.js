import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { fileURLToPath, pathToFileURL } from "url";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateTraining = async (name, date) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 Landscape

  // ✅ Update path to actual location
  const imagePath = path.resolve(
    __dirname,
    "../templates/training_template.jpg"
  );

  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Template image not found at ${imagePath}`);
  }

  const imageBytes = fs.readFileSync(imagePath);
  const jpgImage = await pdfDoc.embedJpg(imageBytes);

  page.drawImage(jpgImage, {
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight(),
  });

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawText(name, {
    x: 250,
    y: 350,
    size: 24,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Completed on: ${date}`, {
    x: 250,
    y: 310,
    size: 18,
    font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

export default generateTraining;
