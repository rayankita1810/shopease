const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

// USER / SELLER / ADMIN
router.post(
  "/",
  protect,
  authorizeRoles("user", "seller", "admin"),
  createOrder
);

router.get("/my", protect, getMyOrders);

// ADMIN
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllOrders
);


module.exports = router;