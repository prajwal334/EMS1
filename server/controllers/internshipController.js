// controllers/internshipController.js
import generateInternship from "../utils/generateInternship.js";
import fetch from "node-fetch";

const getInternshipCertificate = async (req, res) => {
  try {
    const userId = req.params.id;

    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Fetch internship data
    const response = await fetch("http://localhost:3000/api/salestask");
    const data = await response.json();

    const internships = data.internships || data;
    const user = internships.find((item) => item._id === userId);

    if (!user) {
      return res.status(404).send("Internship user not found");
    }

    const name = user.customer_name;
    const domain = user.domain_interested;
    const imageUrl = user.upload_image;

    // Format date range: "July - August"
    const start = new Date(user.internship_start_date);
    const end = new Date(user.internship_end_date);

    const isValidStart = !isNaN(start.getTime());
    const isValidEnd = !isNaN(end.getTime());

    const startMonth = isValidStart
      ? start.toLocaleString("en-US", { month: "long" })
      : "Invalid";
    const endMonth = isValidEnd
      ? end.toLocaleString("en-US", { month: "long" })
      : "Invalid";

    const dateRange = `${startMonth} - ${endMonth}`;

    // 🔹 Generate certificate PDF and certification ID
    const { pdfBytes, certificationId } = await generateInternship(
      name,
      dateRange,
      domain,
      imageUrl
    );

    // 🔹 Save certification ID to the database
    await fetch(`http://localhost:3000/api/salestask/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ internship_certificate_id: certificationId }),
    });

    // 🔹 Send the certificate PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${name}_internship_certificate.pdf`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("❌ Internship certificate generation error:", error);
    res.status(500).send("Error generating internship certificate");
  }
};

export default getInternshipCertificate;
