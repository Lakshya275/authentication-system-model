const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("./user");

/* =========================
   ✅ REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 🔍 Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.send("User already exists ❌");
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 Save user
    const user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user"
    });

    await user.save();

    res.redirect("/login");
  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.send("Registration Failed ❌");
  }
});

/* =========================
   ✅ LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body); // 🔍 debug

    // 🔍 Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.send("User not found ❌");
    }

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Invalid Password ❌");
    }

    // ✅ Store session
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role
    };

    res.redirect("/dashboard");

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.send("Login Failed ❌");
  }
});

/* =========================
   ✅ LOGOUT
========================= */
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
