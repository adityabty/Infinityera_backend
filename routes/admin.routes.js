const express = require("express");
const User = require("../models/User");
const Bot = require("../models/Bot");
const Payment = require("../models/Payment");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// ---------- All Users ----------
router.get("/users", auth, admin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// ---------- All Bots ----------
router.get("/bots", auth, admin, async (req, res) => {
  const bots = await Bot.find().populate("userId", "username email");
  res.json(bots);
});

// ---------- Dashboard Stats ----------
router.get("/stats", auth, admin, async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalBots = await Bot.countDocuments();
  const runningBots = await Bot.countDocuments({ status: "running" });

  const revenue = await Payment.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  res.json({
    totalUsers,
    totalBots,
    runningBots,
    totalRevenue: revenue[0]?.total || 0
  });
});

module.exports = router;
