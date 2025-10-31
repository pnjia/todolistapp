const express = require("express");
const app = express();

const prisma = require("./config/database");

const authRoutes = require("./modules/auth/auth.routes");
const todoRoutes = require("./modules/todo/todo.routes");

app.get("/", (req, res) => {
  res.send("Hello, world! AGAIN.");
});

async function start() {
  try {
    await prisma.$connect();
    console.log("Connected to the database");

    app.use("/auth", authRoutes);

    app.use("/todo", todoRoutes);

    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
