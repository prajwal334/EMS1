import generateTraining from "../utils/generateTraining.js";
import fetch from "node-fetch";

const getCertificate = async (req, res) => {
  try {
    const userId = req.params.id;

    // Set CORS headers (for frontend communication)
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Fetch all sales tasks
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

    // ✅ Generate PDF and get certification ID + issue date
    const { pdfBytes, certificationId, issuedOn } = await generateTraining(
      name,
      completionDate,
      domain
    );

    // ✅ Store both certification ID and issued date in DB
    await fetch(`http://localhost:3000/api/salestask/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        training_certificate_id: certificationId,
        certificate_issued_on: issuedOn, // save formatted date
      }),
    });

    // Send certificate as downloadable PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${name}_certificate.pdf`
    );

    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("❌ Certificate generation error:", error);
    res.status(500).send("Error generating certificate");
  }
};

export default getCertificate;
