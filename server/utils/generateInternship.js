import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { fileURLToPath } from "url";
import QRCode from "qrcode";
import fetch from "node-fetch"; // Required for fetching image URL

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateRandomCode = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateInternship = async (name, dateRange, domain, imageUrl) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 Landscape

  // ✅ Embed background template (optional)
  const imagePath = path.resolve(
    __dirname,
    "../templates/internship_template.jpg"
  );
  if (fs.existsSync(imagePath)) {
    const imageBytes = fs.readFileSync(imagePath);
    const background = await pdfDoc.embedJpg(imageBytes);
    page.drawImage(background, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });
  }

  // ✅ Embed uploaded image if provided
  if (imageUrl) {
    try {
      const res = await fetch(imageUrl);
      const buffer = await res.arrayBuffer();
      const img = imageUrl.endsWith(".png")
        ? await pdfDoc.embedPng(buffer)
        : await pdfDoc.embedJpg(buffer);

      page.drawImage(img, {
        x: 685,
        y: 340,
        width: 111,
        height: 115,
      });
    } catch (err) {
      console.warn("⚠️ Failed to load image from URL:", imageUrl);
    }
  }

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const certificationId = generateRandomCode();
  const verifyUrl = `https://navikshaa.com/verify/${certificationId}`;

  // Name
  page.drawText(name, {
    x: 27,
    y: 390,
    size: 24,
    font,
    color: rgb(0, 0, 0),
  });

  // Domain
  page.drawText(`${domain}`, {
    x: 27,
    y: 310,
    size: 20,
    font,
    color: rgb(0, 0, 1),
  });

  // Date Range (e.g., "July - August")
  page.drawText(dateRange, {
    x: 210,
    y: 195,
    size: 18,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Certification ID
  page.drawText(certificationId, {
    x: 120,
    y: 65,
    size: 13,
    font,
    color: rgb(0.6, 0.6, 0.7),
  });

  // Verification URL
  page.drawText(verifyUrl, {
    x: 10,
    y: 32,
    size: 12,
    font,
    color: rgb(0.4, 0.8, 1),
  });

  // QR Code
  const qrDataUrl = await QRCode.toDataURL(verifyUrl);
  const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  page.drawImage(qrImage, {
    x: 750,
    y: 8,
    width: 70,
    height: 68,
  });

  const pdfBytes = await pdfDoc.save();
  return { pdfBytes, certificationId };
};

export default generateInternship;
