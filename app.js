const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./auth");
const { isAuthenticated, isAdmin } = require("./authmiddleware");

const app = express();

/* =========================
   ✅ MIDDLEWARE
========================= */

// Parse form data (HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON data (fetch / API requests) ✅ IMPORTANT
app.use(express.json());

// Serve static files (CSS, JS, HTML)
app.use(express.static(__dirname));

/* =========================
   ✅ SESSION SETUP
========================= */
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false, // better practice
    cookie: { secure: false } // set true only in HTTPS
  })
);

/* =========================
   ✅ DATABASE CONNECTION
========================= */
mongoose.connect("mongodb://127.0.0.1:27017/authDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));
/* =========================
   ✅ ROUTES
========================= */

// Auth routes (login, register)
app.use("/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Pages
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Protected routes
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

app.get("/admin", isAuthenticated, isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

/* =========================
   ✅ SERVER START
========================= */
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
