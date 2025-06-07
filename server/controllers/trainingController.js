import generateTraining from "../utils/generateTraining.js";
import fetch from "node-fetch";

const getCertificate = async (req, res) => {
  try {
    const userId = req.params.id;

    const response = await fetch("http://localhost:3000/api/salestask");
    const data = await response.json();

    console.log("Sales task API data:", data);

    // Adjust here according to your API response structure
    const tasks = data.salestasks || data; 
    const user = tasks.find((item) => item._id === userId);

    if (!user) {
      return res.status(404).send("Sales task user not found");
    }

    const name = user.customer_name;
    const completionDate = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

    console.log(`Generating certificate for ${name} on ${completionDate}`);

    const pdfBytes = await generateTraining(name, completionDate);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=certificate.pdf"
    );

    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Certificate generation error:", error);
    res.status(500).send("Error generating certificate");
  }
};

export default getCertificate;
