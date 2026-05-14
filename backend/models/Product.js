const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    category: String,
    stock: Number,
    image: String,

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
