const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.send("Login Page");
});

// Handle 404 for auth routes
router.use((req, res) => {
  res.status(404).json({ message: "Halaman tidak ditemukan" });
});

module.exports = router;
