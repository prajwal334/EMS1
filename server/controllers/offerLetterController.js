import fetch from "node-fetch";
import { generateOfferLetter } from "../utils/generateOfferletter.js";

export const getOfferLetter = async (req, res) => {
  try {
    const userId = req.params.id;

    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Fetch sales tasks data
    const response = await fetch("http://localhost:3000/api/salestask");
    const data = await response.json();

    const tasks = data.salestasks || data;
    const user = tasks.find((item) => item._id === userId);

    if (!user) return res.status(404).send("User not found");

    const {
      customer_name,
      domain_interested,
      internship_start_date,
      internship_end_date,
    } = user;

    if (!internship_start_date || !internship_end_date) {
      return res.status(400).send("Internship dates missing");
    }

    const pdfBytes = await generateOfferLetter(
      customer_name,
      domain_interested,
      internship_start_date,
      internship_end_date
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${customer_name}_offer_letter.pdf`
    );

    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error generating offer letter:", error);
    res.status(500).send("Error generating offer letter");
  }
};
