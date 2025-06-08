import generateTraining from "../utils/generateTraining.js";
import fetch from "node-fetch";

const getCertificate = async (req, res) => {
  try {
    const userId = req.params.id;

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Fetch sales tasks
    const response = await fetch("http://localhost:3000/api/salestask");
    const data = await response.json();

    const tasks = data.salestasks || data;
    const user = tasks.find((item) => item._id === userId);

    if (!user) {
      return res.status(404).send("Sales task user not found");
    }

    const name = user.customer_name;
    const domain = user.domain_interested;
    const completionDate = new Date().toISOString().split("T")[0];

    // ✅ Generate certificate PDF and ID
    const { pdfBytes, certificationId } = await generateTraining(
      name,
      completionDate,
      domain
    );

    // Set headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${name}_certificate.pdf`
    );

    // Send PDF as response
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("❌ Certificate generation error:", error);
    res.status(500).send("Error generating certificate");
  }
};

export default getCertificate;
