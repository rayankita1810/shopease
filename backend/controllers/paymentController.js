import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";

export const createRazorpayOrder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.error("Create Razorpay Order Error:", err);
    res.status(500).json({ message: "Error creating order" });
  }
};

// ✅ VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    res.json({
      success: true,
      message: "Payment verified",
    });
  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};
