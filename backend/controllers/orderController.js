const Order = require("../models/Order");
const Product = require("../models/Product");

// 🛒 Create Order
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentId,
      razorpayOrderId,
    } = req.body;

    // FINAL ORDER ITEMS
    const finalOrderItems = [];

    let totalPrice = 0;

    // LOOP THROUGH ITEMS
    for (const item of orderItems) {
      // FETCH PRODUCT
      const product = await Product.findById(
        item.product
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      // DEBUG
      // console.log("FULL PRODUCT:", product);

      // console.log("PRODUCT SELLER:", product.seller);

      // CHECK STOCK
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      // REDUCE STOCK
      product.stock -= item.quantity;

      await product.save();

      // BUILD SAFE ORDER ITEM
      const orderItem = {
        product: product._id,

        seller: product.seller,

        name: product.name,

        image: product.image,

        quantity: item.quantity,

        price: product.price,

        status: "Pending",
      };

      // DEBUG
      // console.log("ORDER ITEM:", orderItem);

      finalOrderItems.push(orderItem);

      // TOTAL PRICE
      totalPrice += product.price * item.quantity;
    }

    // DEBUG
    // console.log(
    //   "FINAL ORDER ITEMS:",
    //   finalOrderItems
    // );

    // CREATE ORDER
    const order = await Order.create({
      user: req.user._id,

      shippingAddress,

      orderItems: finalOrderItems,

      totalPrice,

      paymentStatus: "Paid",

      paymentId,

      razorpayOrderId,
    });

    // DEBUG
    // console.log("CREATED ORDER:", order);

    res.status(201).json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// 📦 Get Logged-in User Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).populate(
      "orderItems.product",
      "name price image"
    );

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 👑 Admin: Get All Orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()

      // USER DETAILS
      .populate("user", "name email")

      // PRODUCT + SELLER DETAILS
      .populate({
        path: "orderItems.product",
        select: "name price image seller",
        populate: {
          path: "seller",
          select: "name email",
        },
      })

      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

