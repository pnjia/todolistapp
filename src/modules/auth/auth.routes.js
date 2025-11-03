import express from "express";
import { login, register, logout } from "./auth.controllers.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { refreshToken } from "./auth.controllers.js";
import { loginValidation, registerValidation } from "./auth.validation.js";
import { validatorMiddleware } from "../../middlewares/validator.js";
const router = express.Router();

router.post("/register", registerValidation, validatorMiddleware, register);
router.post("/login", loginValidation, validatorMiddleware, login);
router.post("/logout", authMiddleware, logout);
router.post("/refresh", refreshToken);
router.get("/", authMiddleware, (req, res) => {
  res.send("Berhasil berjalan");
});

// Handle 404 for auth routes
router.use((req, res) => {
  res.status(404).json({ message: "Halaman tidak ditemukan" });
});

export default router;
