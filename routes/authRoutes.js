const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");
const { register, login, logout, getAllUsers, getUserById } = require("../controller/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/", authMiddleware, roleMiddleware(["admin"]), getAllUsers);
router.get("/:id", authMiddleware, getUserById);

module.exports = router;
