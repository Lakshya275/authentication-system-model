const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("./user");

// REGISTER
router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    role: "user"
  });

  await user.save();
  res.redirect("/login");
});

// LOGIN
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user && await bcrypt.compare(req.body.password, user.password)) {
    req.session.user = user;
    res.redirect("/dashboard");
  } else {
    res.send("Invalid Credentials ❌");
  }
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;