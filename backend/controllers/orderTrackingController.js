const Order = require("../models/Order");

const trackOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("orderItems.product", "name image price");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);

  } catch (error) {
    // console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  trackOrderById,
};