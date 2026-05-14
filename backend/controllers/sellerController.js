const Product = require("../models/Product");
const Order = require("../models/Order");

exports.getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id; // ✅ FIX

    // console.log("Seller ID:", sellerId);

    const totalProducts = await Product.countDocuments({
      seller: sellerId,
    });

    const pendingProducts = await Product.countDocuments({
      seller: sellerId,
      status: "pending",
    });

    const approvedProducts = await Product.countDocuments({
      seller: sellerId,
      status: "approved",
    });

    // Orders containing seller's products
    const orders = await Order.find({
      "orderItems.product": { $exists: true },
    }).populate("orderItems.product");

    let totalOrders = 0;
    let totalRevenue = 0;

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (
          item.product &&
          item.product.seller.toString() === sellerId.toString()
        ) {
          totalOrders++;
          totalRevenue += item.product.price * item.quantity;
        }
      });
    });

    res.json({
      totalProducts,
      pendingProducts,
      approvedProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("SELLER DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// 📦 Get seller's products
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ✏️ Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Only seller can edit own product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.image = image || product.image;

    // 🔥 VERY IMPORTANT
    product.status = "pending";

    await product.save();

    res.json({ message: "Product updated & sent for approval" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📦 Get Seller Orders
exports.getSellerOrders = async (req, res) => {
  try {
    // FIND ORDERS CONTAINING SELLER PRODUCTS
    const orders = await Order.find({
      "orderItems.seller": req.user._id,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // FILTER ONLY SELLER ITEMS
    const sellerOrders = orders.map((order) => {
      const filteredItems = order.orderItems.filter(
        (item) => item.seller.toString() === req.user._id.toString(),
      );

      return {
        _id: order._id,

        user: order.user,

        shippingAddress: order.shippingAddress,

        paymentStatus: order.paymentStatus,

        createdAt: order.createdAt,

        orderItems: filteredItems,
      };
    });

    res.json(sellerOrders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch seller orders",
    });
  }
};
// ✅ Update overall order status based on items
const updateOrderStatus = (order) => {
  const statuses = order.orderItems.map((item) => item.status);

  const allShippedOrDelivered = statuses.every((s) =>
    ["Shipped", "Delivered"].includes(s)
  );

  const allDelivered = statuses.every(
    (s) => s === "Delivered"
  );

  const allCancelled = statuses.every(
    (s) => s === "Cancelled"
  );

  const anyCancelled = statuses.some(
    (s) => s === "Cancelled"
  );

  // ✅ Delivered
  if (allDelivered) {
    order.orderStatus = "Delivered";
  }

  // ✅ Cancelled
  else if (allCancelled) {
    order.orderStatus = "Cancelled";
  }

  // ✅ Partially Cancelled
  else if (anyCancelled) {
    order.orderStatus = "Partially Cancelled";
  }

  // ✅ Shipped
  else if (allShippedOrDelivered) {
    order.orderStatus = "Shipped";
  }

  // ✅ Default
  else {
    order.orderStatus = "Processing";
  }
};
// 📦 SELLER: Update single order item status
exports.updateSellerOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const status = req.body.status.trim();

    const allowed = ["Pending", "Packed", "Shipped"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: "Invalid status for seller",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      "orderItems.seller": req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const item = order.orderItems.find(
      (i) => i._id.toString() === itemId
    );

    if (!item) {
      return res.status(404).json({
        message: "Order item not found",
      });
    }

    // 🔒 ownership check
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized for this item",
      });
    }

    // ❌ prevent overwriting final states
    if (item.status === "Delivered" || item.status === "Cancelled") {
      return res.status(400).json({
        message: "Cannot update final order status",
      });
    }

    // ✅ update
    item.status = status;

    updateOrderStatus(order);

    await order.save();

    res.json({
      message: "Order item status updated",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};