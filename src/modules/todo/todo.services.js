import prisma from "../../config/database.js";
import { errorResponse } from "../../utils/response.js";

export const getTodos = async (req, res) => {
  const userId = req.user?.id;
  console.log({ userId });
  const todos = await prisma.todo.findMany({
    where: { userId, deleted_at: null },
  });

  return todos;
};

export const getTodoById = async (req, res) => {
  const userId = req.user?.id;
  const todoId = parseInt(req.params.id, 10);

  const todo = await prisma.todo.findFirst({
    where: { id: todoId, userId, deleted_at: null },
  });
  console.log({ todo });
  if (!todo) {
    return errorResponse(res, 404, "Todo not found");
  }

  return todo;
};

export const createTodo = async (req, res) => {
  const userId = req.user?.id;
  console.log({ userId });

  const { title, description } = req.body;
  const newTodo = await prisma.todo.create({
    data: {
      title,
      description,
      userId,
    },
  });
  return newTodo;
};

export const editTodo = async (req, res) => {
  const userId = req.user?.id;
  const todoId = parseInt(req.params.id, 10);
  console.log({ userId, todoId });
  const { title, description, priority, due_date, completed } = req.body;

  const existingTodo = await prisma.todo.findFirst({
    where: { id: todoId, userId, deleted_at: null },
  });

  if (!existingTodo) {
    return errorResponse(res, 404, "Todo not found");
  }

  const updatedTodo = await prisma.todo.update({
    where: { id: todoId },
    data: {
      title,
      description,
      priority,
      due_date,
      completed,
    },
  });

  return updatedTodo;
};

export const completeTodo = async (req, res) => {
  const userId = req.user?.id;
  const todoId = parseInt(req.params.id, 10);
  const { completed } = req.body;

  console.log({ userId });
  console.log({ todoId });

  const todo = await prisma.todo.update({
    where: { id: todoId, userId, deleted_at: null },
    data: { completed },
  });

  console.log({ todo });
  return todo;
};

export const deleteTodo = async (req, res) => {
  const userId = req.user?.id;
  const todoId = parseInt(req.params.id, 10);

  const existingTodo = await prisma.todo.findFirst({
    where: { id: todoId, userId, deleted_at: null },
  });

  if (!existingTodo) {
    return errorResponse(res, 404, "Todo tidak ditemukan atau sudah dihapus");
  }

  const deletedTodo = await prisma.todo.update({
    where: { id: todoId },
    data: { deleted_at: new Date() },
  });

  return deletedTodo;
};

export const restoreTodo = async (req, res) => {
  const userId = req.user?.id;
  const todoId = parseInt(req.params.id, 10);

  const existingTodo = await prisma.todo.findFirst({
    where: { id: todoId, userId, deleted_at: { not: null } },
  });

  if (!existingTodo) {
    return errorResponse(res, 400, "Todo tidak ditemukan atau belum terhapus");
  }

  const restoredTodo = await prisma.todo.update({
    where: { id: todoId },
    data: { deleted_at: null },
  });

  return restoredTodo;
};
