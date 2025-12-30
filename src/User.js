const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  credits: { type: Number, default: 0 },

  plan: {
    type: String,
    enum: ["starter", "pro", "enterprise", "none"],
    default: "none",
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
