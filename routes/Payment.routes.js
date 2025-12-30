const express = require("express");
const Payment = require("../models/Payment");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// ---------- Create Payment ----------
router.post("/create", auth, async (req, res) => {
  try {
    const { amount, plan } = req.body;

    const payment = await Payment.create({
      userId: req.user.userId,
      amount,
      plan,
      status: "pending"
    });

    res.json({ message: "Payment created", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Verify Payment ----------
router.post("/verify", auth, async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    payment.status = "completed";
    payment.transactionId = transactionId;
    await payment.save();

    const user = await User.findById(req.user.userId);
    user.plan = payment.plan;
    await user.save();

    res.json({ message: "Payment verified", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Get Payment History ----------
router.get("/", auth, async (req, res) => {
  const payments = await Payment.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.json(payments);
});

module.exports = router;
