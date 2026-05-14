import express from "express";
import upload from "../middleware/uploadMiddleware.js";

import {
  addProductsFromCSV,
  addProduct,
  getProducts,
  getProductById,
  deleteProduct,
  searchProducts,
  getPendingProducts,
  approveProduct,
  rejectProduct,
  trendingProduct,
  getTrendingProducts,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* =========================
   PUBLIC ROUTES
========================= */
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/trending", getTrendingProducts);

/* =========================
   BULK CSV UPLOAD
========================= */
router.post(
  "/bulk",
  protect,
  authorizeRoles("seller", "admin"),
  upload.single("file"),
  addProductsFromCSV
);

/* =========================
   ADMIN ROUTES
========================= */
router.get("/pending", protect, authorizeRoles("admin"), getPendingProducts);

router.put("/approve/:id", protect, authorizeRoles("admin"), approveProduct);

router.delete("/reject/:id", protect, authorizeRoles("admin"), rejectProduct);

router.patch("/:id/trending", protect, authorizeRoles("admin"), trendingProduct);

/* =========================
   SINGLE PRODUCT UPLOAD
========================= */
router.post(
  "/",
  protect,
  authorizeRoles("seller", "admin"),
  upload.single("image"),
  addProduct
);

/* =========================
   DELETE PRODUCT
========================= */
router.delete(
  "/:id",
  protect,
  authorizeRoles("seller", "admin"),
  deleteProduct
);

/* =========================
   GET PRODUCT BY ID (LAST)
========================= */
router.get("/:id", getProductById);

export default router;