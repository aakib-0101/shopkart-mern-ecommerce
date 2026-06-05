const admin = (req, res, next) => {
  console.log("REQ USER:", req.user);

  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied. Admin only.",
      user: req.user,
    });
  }
};

module.exports = admin;