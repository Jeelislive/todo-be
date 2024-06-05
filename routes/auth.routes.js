const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/middle");
const authController = require("../controllers/auth.controllers");



router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/dashboard", authMiddleware, authController.dashboard)

module.exports = router;