const express = require("express");
const { exec } = require("child_process");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const Bot = require("../models/Bot");
const auth = require("../middleware/auth");

const router = express.Router();

// ---------- Multer Upload Config ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `./uploads/${req.user.userId}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ---------- Create Bot ----------
router.post("/create", auth, upload.single("botFile"), async (req, res) => {
  try {
    const { botName, botToken } = req.body;

    if (!req.file) return res.status(400).json({ error: "Bot file is required" });

    const bot = await Bot.create({
      userId: req.user.userId,
      botName,
      botToken,
      botFile: req.file.path
    });

    res.status(201).json({ message: "Bot created", bot });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Get User Bots ----------
router.get("/", auth, async (req, res) => {
  const bots = await Bot.find({ userId: req.user.userId });
  res.json(bots);
});

// ---------- Get Bot Details ----------
router.get("/:id", auth, async (req, res) => {
  const bot = await Bot.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!bot) return res.status(404).json({ error: "Bot not found" });

  res.json(bot);
});

// ---------- Start Bot ----------
router.post("/:id/start", auth, async (req, res) => {
  const bot = await Bot.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!bot) return res.status(404).json({ error: "Bot not found" });

  if (bot.status === "running")
    return res.status(400).json({ error: "Bot already running" });

  const command = `node ${bot.botFile}`;

  const processRef = exec(command, { detached: true });

  bot.processId = processRef.pid;
  bot.status = "running";
  bot.lastStarted = new Date();
  bot.restartCount += 1;

  bot.logs.push({ timestamp: new Date(), message: "Bot started" });

  await bot.save();

  res.json({ message: "Bot started", bot });
});

// ---------- Stop Bot ----------
router.post("/:id/stop", auth, async (req, res) => {
  const bot = await Bot.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!bot) return res.status(404).json({ error: "Bot not found" });

  if (bot.processId) {
    try {
      process.kill(bot.processId);
    } catch {}
  }

  bot.status = "stopped";
  bot.processId = null;

  bot.logs.push({ timestamp: new Date(), message: "Bot stopped" });

  await bot.save();

  res.json({ message: "Bot stopped", bot });
});

// ---------- Delete Bot ----------
router.delete("/:id", auth, async (req, res) => {
  const bot = await Bot.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!bot) return res.status(404).json({ error: "Bot not found" });

  if (fs.existsSync(bot.botFile)) fs.unlinkSync(bot.botFile);

  await Bot.deleteOne({ _id: bot._id });

  res.json({ message: "Bot deleted" });
});

// ---------- Get Bot Logs ----------
router.get("/:id/logs", auth, async (req, res) => {
  const bot = await Bot.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!bot) return res.status(404).json({ error: "Bot not found" });

  res.json({ logs: bot.logs });
});

module.exports = router;
