import express from "express";
import { login, register } from "./auth.controllers.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", authMiddleware, (req, res) => {
  res.send("Berhasil berjalan");
});

// Handle 404 for auth routes
router.use((req, res) => {
  res.status(404).json({ message: "Halaman tidak ditemukan" });
});

export default router;
