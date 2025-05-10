import Pf from "../models/Pf.js";

export const createOrUpdatePf = async (req, res) => {
  try {
    const { userId, lastUpdatedPf, paidAmount } = req.body;

    const currentUpdatedPf = lastUpdatedPf + paidAmount;
    const interestCompany = (3.25 / 100) * paidAmount;
    const interestGovernment = (10 / 100) * paidAmount;
    const total =
      1500 + currentUpdatedPf + interestCompany + interestGovernment;

    const existingPf = await Pf.findOne({ userId });

    if (existingPf) {
      existingPf.lastUpdatedPf = lastUpdatedPf;
      existingPf.paidAmount = paidAmount;
      existingPf.currentUpdatedPf = currentUpdatedPf;
      existingPf.interestCompany = interestCompany;
      existingPf.interestGovernment = interestGovernment;
      existingPf.total = total;

      await existingPf.save();
      return res.status(200).json(existingPf);
    }

    const newPf = new Pf({
      userId,
      lastUpdatedPf,
      paidAmount,
      currentUpdatedPf,
      interestCompany,
      interestGovernment,
      total,
    });

    await newPf.save();
    res.status(201).json(newPf);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPfByUserId = async (req, res) => {
  try {
    const pf = await Pf.findOne({ userId: req.params.userId });
    if (!pf) return res.status(404).json({ message: "PF data not found" });
    res.status(200).json(pf);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
