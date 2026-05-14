import express from "express";
import {
  getAdminStats,
  getAllProductsAdmin,
  getAllUsers,
  getAdminRevenue,
  updateAdminOrderItemStatus,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// admin stats
router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);
router.get("/products", protect, authorizeRoles("admin"), getAllProductsAdmin);
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.get("/revenue", protect, authorizeRoles("admin"), getAdminRevenue);
router.put(
  "/order/:orderId/item/:itemId",
  protect,
  authorizeRoles("admin"),
  updateAdminOrderItemStatus
);
export default router;
