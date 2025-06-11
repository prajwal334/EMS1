import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateOfferLetter = async (name, domain, startDate, endDate) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 Landscape

  // Optional: load template image if available
  const templatePath = path.resolve(
    __dirname,
    "../templates/offer_letter_template.jpg"
  );
  if (fs.existsSync(templatePath)) {
    const templateBytes = fs.readFileSync(templatePath);
    const templateImage = await pdfDoc.embedJpg(templateBytes);
    page.drawImage(templateImage, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });
  }

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const formattedStart = new Date(startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  const formattedEnd = new Date(endDate).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  const durationMs = new Date(endDate) - new Date(startDate);
  const durationDays = Math.round(durationMs / (1000 * 60 * 60 * 24)) + 1;

  page.drawText(` ${name}`, {
    x: 75,
    y: 503,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  page.drawText(` ${domain}`, {
    x: 400,
    y: 455,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  page.drawText(` ${formattedStart}`, {
    x: 380,
    y: 420,
    size: 12,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText(` ${formattedEnd}`, {
    x: 380,
    y: 390,
    size: 12,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText(`${durationDays} day${durationDays > 1 ? "s" : ""}`, {
    x: 380,
    y: 360,
    size: 12,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
