// routes/salesRoutes.js
import express from "express";
import {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
  getSalesByName,
  getSalesByMarketedFrom,
  upload,
  uploadSaleImage,
  deleteImage,
  updateDownloadStatus,
} from "../controllers/salesTaskController.js";

const router = express.Router();

router.post("/add", createSale);
router.get("/", getAllSales);

router.get("/name/:name", getSalesByName);
router.get("/marketed-from/:marketed_from", getSalesByMarketedFrom);

router.get("/:id", getSaleById);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);
router.post("/upload-image", upload.single("image"), uploadSaleImage);
router.delete("/delete-image/:id", deleteImage);
router.patch("/salestask/:id/download", updateDownloadStatus);

export default router;
