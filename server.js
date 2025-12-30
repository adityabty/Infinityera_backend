const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const botRoutes = require("./routes/bot.routes");
const paymentRoutes = require("./routes/payment.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ---------- DB ----------
connectDB();

// ---------- Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/bots", botRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

// ---------- Health Check ----------
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date() });
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
