import express from "express";
const app = express();

import prisma from "./config/database.js";

import authRoutes from "./modules/auth/auth.routes.js";
import todoRoutes from "./modules/todo/todo.routes.js";

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world! AGAIN.");
});

app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);

async function start() {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();

export default app;
