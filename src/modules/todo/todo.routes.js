import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import {
  completeTodo,
  createTodo,
  deleteTodo,
  editTodo,
  getTodoById,
  getTodos,
  restoreTodo,
} from "./todo.controllers.js";
import { userMiddleware } from "../../middlewares/userMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, userMiddleware, getTodos);
router.post("/", authMiddleware, userMiddleware, createTodo);
router.get("/:id", authMiddleware, userMiddleware, getTodoById);
router.put("/:id", authMiddleware, userMiddleware, editTodo);
router.patch("/:id/complete", authMiddleware, userMiddleware, completeTodo);
router.delete("/:id", authMiddleware, userMiddleware, deleteTodo);
router.post("/:id/restore", authMiddleware, userMiddleware, restoreTodo);

export default router;
