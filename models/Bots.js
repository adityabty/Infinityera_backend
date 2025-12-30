const mongoose = require("mongoose");

const botSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  botName: { type: String, required: true },
  botToken:{ type: String, required: true },
  botFile: { type: String, required: true },

  status: { type: String, enum: ["stopped","running","error"], default: "stopped" },
  processId: { type: Number },
  port: { type: Number },

  logs: [{ timestamp: Date, message: String }],

  createdAt: { type: Date, default: Date.now },
  lastStarted: { type: Date },
  restartCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Bot", botSchema);
