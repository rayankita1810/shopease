const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  getSellerDashboard,
  getMyProducts,
  updateProduct,
  getSellerOrders,
  updateSellerOrderItemStatus
} = require("../controllers/sellerController");

router.get(
  "/stats",
  protect,
  authorizeRoles("seller", "admin"),
  getSellerDashboard,
);

router.get(
  "/products",
  protect,
  authorizeRoles("seller", "admin"),
  getMyProducts,
);
router.get(
  "/orders",
  protect,
  authorizeRoles("seller", "admin"),
  getSellerOrders,
);
router.patch(
  "/order/:orderId/item/:itemId",
  protect,
  authorizeRoles("seller"),
  updateSellerOrderItemStatus
);
router.put(
  "/product/:id",
  protect,
  authorizeRoles("seller", "admin"),
  updateProduct,
);

module.exports = router;
