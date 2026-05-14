const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String,
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        name: String,

        image: String,

        quantity: Number,

        price: Number,

        status: {
          type: String,
          enum: ["Pending", "Packed", "Shipped", "Delivered", "Cancelled"],
          default: "Pending",
        },
      },
    ],
    orderStatus: {
      type: String,
      enum: [
        "Processing",
        "Partially Shipped",
        "Shipped",
        "Delivered",
        "Partially Cancelled",
        "Cancelled",
      ],
      default: "Processing",
    },

    totalPrice: Number,

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    paymentId: String,

    razorpayOrderId: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
