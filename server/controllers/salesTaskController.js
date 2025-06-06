// controllers/salesController.js
import mongoose from "mongoose";
import Sales from "../models/SaleTask.js";

// Create a new sales entry
const createSale = async (req, res) => {
  try {
    const newSale = new Sales(req.body);
    const savedSale = await newSale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: "Error creating sale", error });
  }
};

// Get all sales
const getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find().sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error });
  }
};

//getSalesByName
const getSalesByName = async (req, res) => {
  try {
    const { name } = req.params;
    const sales = await Sales.find({
      name: { $regex: new RegExp(name, "i") }, // case-insensitive match
    });

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales by name", error });
  }
};

// Get a single sale by ID
const getSaleById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid sale ID" });
  }

  try {
    const sale = await Sales.findById(id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sale", error });
  }
};

// Update a sale
const updateSale = async (req, res) => {
  try {
    const updatedSale = await Sales.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
        overwrite: false,
      }
    );

    if (!updatedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json(updatedSale);
  } catch (error) {
    res.status(400).json({ message: "Error updating sale", error });
  }
};

// Delete a sale
const deleteSale = async (req, res) => {
  try {
    console.log("Delete request for ID:", req.params.id); // debug log
    const deletedSale = await Sales.findByIdAndDelete(req.params.id);
    if (!deletedSale)
      return res.status(404).json({ message: "Sale not found" });
    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error); // debug log
    res.status(500).json({ message: "Error deleting sale", error });
  }
};

// Get sales by marketed_from
const getSalesByMarketedFrom = async (req, res) => {
  try {
    const { marketed_from } = req.params;
    const sales = await Sales.find({
      marketed_from: { $regex: new RegExp(marketed_from, "i") }, // case-insensitive search
    });

    res.status(200).json(sales);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching sales by marketed_from", error });
  }
};

export {
  createSale,
  deleteSale,
  getSaleById,
  updateSale,
  getAllSales,
  getSalesByName,
  getSalesByMarketedFrom,
};
