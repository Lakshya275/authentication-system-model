function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// 🔥 RBAC

module.exports = { isAuthenticated, isAdmin };
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  }
  res.send("Access Denied ❌ (Admin only)");
}
