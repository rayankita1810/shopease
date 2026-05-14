// controllers/adminController.js

import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    const approvedProducts = await Product.countDocuments({
      status: "approved",
    });

    const pendingProducts = await Product.countDocuments({
      status: "pending",
    });

    const rejectedProducts = await Product.countDocuments({
      status: "rejected",
    });

    const totalOrders = await Order.countDocuments();

    const revenueData = await Order.find({
      paymentStatus: "Paid",
    });

    const totalRevenue = revenueData.reduce(
      (acc, order) => acc + order.totalPrice,
      0,
    );

    res.json({
      totalUsers,
      totalProducts,
      approvedProducts,
      pendingProducts,
      rejectedProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to load stats",
    });
  }
};
// 📦 Get All Products (Admin)
export const getAllProductsAdmin = async (req, res) => {
  try {
    const query = {};

    if (req.query.category) {
      query.category = req.query.category.toLowerCase();
    }

    const products = await Product.find(query).populate("seller", "name email");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// GET ALL USERS WITH FULL DETAILS
// ==========================================

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    // extra data for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const totalOrders = await Order.countDocuments({
          user: user._id,
        });

        const totalProducts = await Product.countDocuments({
          seller: user._id,
        });

        const totalSpentData = await Order.find({
          user: user._id,
          paymentStatus: "Paid",
        });

        const totalSpent = totalSpentData.reduce(
          (acc, item) => acc + item.totalPrice,
          0,
        );

        return {
          ...user._doc,
          totalOrders,
          totalProducts,
          totalSpent,
        };
      }),
    );

    res.json(usersWithStats);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

export const getAdminRevenue = async (req, res) => {
  try {
    // ALL ORDERS
    const orders = await Order.find({}).populate("orderItems.product");

    // TOTAL ORDERS
    const totalOrders = orders.length;

    // PAID ORDERS
    const paidOrders = orders.filter((o) => o.paymentStatus === "Paid");

    // PENDING PAYMENTS
    const pendingPayments = orders.filter(
      (o) => o.paymentStatus !== "Paid",
    ).length;

    // TOTAL REVENUE
    const totalRevenue = paidOrders.reduce(
      (acc, item) => acc + item.totalPrice,
      0,
    );

    // AVERAGE ORDER VALUE
    const averageOrderValue =
      paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

    // =========================
    // MONTHLY REVENUE
    // =========================

    const monthlyMap = {};

    paidOrders.forEach((order) => {
      const date = new Date(order.createdAt);

      const month = date.toLocaleString("default", {
        month: "short",
      });

      if (!monthlyMap[month]) {
        monthlyMap[month] = 0;
      }

      monthlyMap[month] += order.totalPrice;
    });

    const monthlyRevenue = Object.keys(monthlyMap).map((month) => ({
      month,
      revenue: monthlyMap[month],
    }));

    // =========================
    // PAYMENT METHODS
    // =========================

    const paymentMap = {};

    orders.forEach((order) => {
      const method = order.paymentMethod || "Unknown";

      if (!paymentMap[method]) {
        paymentMap[method] = 0;
      }

      paymentMap[method] += 1;
    });

    const paymentMethods = Object.keys(paymentMap).map((method) => ({
      method,
      value: paymentMap[method],
    }));

    // =========================
    // TOP SELLING PRODUCTS
    // =========================

    const productMap = {};

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const productName = item.product?.name || "Unknown Product";

        if (!productMap[productName]) {
          productMap[productName] = 0;
        }

        productMap[productName] += item.quantity;
      });
    });

    const topSellingProducts = Object.keys(productMap)
      .map((name) => ({
        name,
        sales: productMap[name],
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // RESPONSE
    res.json({
      totalRevenue,
      totalOrders,
      paidOrders: paidOrders.length,
      pendingPayments,
      averageOrderValue,

      monthlyRevenue,

      paymentMethods,

      topSellingProducts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch revenue analytics",
    });
  }
};
// 📦 ADMIN: Update Order Item Status (Delivered / Cancelled)
export const updateAdminOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const allowed = ["Delivered", "Cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: "Invalid status for admin",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // find item
    const item = order.orderItems.find((i) => i._id.toString() === itemId);

    if (!item) {
      return res.status(404).json({
        message: "Order item not found",
      });
    }

    // update status
    item.status = status;

    // =========================
    // AUTO ORDER STATUS UPDATE
    // =========================
    const items = order.orderItems;

    const allDelivered = items.every((i) => i.status === "Delivered");

    const allCancelled = items.every((i) => i.status === "Cancelled");

    const anyCancelled = items.some((i) => i.status === "Cancelled");

    if (allDelivered) {
      order.orderStatus = "Delivered";
    } else if (allCancelled) {
      order.orderStatus = "Cancelled";
    } else if (anyCancelled) {
      order.orderStatus = "Partially Cancelled";
    } else {
      order.orderStatus = "Processing";
    }

    await order.save();

    res.json({
      message: "Admin updated order item status",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
