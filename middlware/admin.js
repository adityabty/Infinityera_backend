const User = require("../models/User");

module.exports = async (req, res, next) => {
  const user = await User.findById(req.user.userId);

  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }

  next();
};
