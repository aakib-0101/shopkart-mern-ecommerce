const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
  getDashboardStats,
  getAllOrders,
  getAllUsers,
  getAllProducts,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController");
router.get("/stats", protect, admin, getDashboardStats);
router.get("/orders", protect, admin, getAllOrders);
router.get("/users", protect, admin, getAllUsers);
router.get("/products", protect, admin, getAllProducts);
router.put("/users/:id/role", protect, admin, updateUserRole);
router.delete("/users/:id", protect, admin, deleteUser);
module.exports = router;