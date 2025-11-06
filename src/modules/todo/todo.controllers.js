import { errorResponse, successResponse } from "../../utils/response.js";
import * as todoService from "./todo.services.js";

export const getTodos = async (req, res) => {
  try {
    const todos = await todoService.getTodos(req, res);
    return successResponse(res, 200, "Todo berhasil diambil", todos);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getTodoById = async (req, res) => {
  try {
    const todo = await todoService.getTodoById(req, res);
    return successResponse(
      res,
      200,
      `Todo dengan id ${todo.id} berhasil diambil`,
      todo
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
export const createTodo = async (req, res) => {
  try {
    const todo = await todoService.createTodo(req, res);
    return successResponse(res, 201, "Todo berhasil dibuat", todo);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const editTodo = async (req, res) => {
  try {
    const todo = await todoService.editTodo(req, res);
    return successResponse(
      res,
      200,
      `Todo dengan id ${todo.id} berhasil diupdate`,
      todo
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const completeTodo = async (req, res) => {
  try {
    const { TODOID } = req.params.id;
    console.log({ TODOID });
    console.log({ req });
    const todo = await todoService.completeTodo(req, res);
    return successResponse(
      res,
      200,
      `Todo dengan id ${todo.id} berhasil diupdate complete`,
      todo
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const deleteTodo = await todoService.deleteTodo(req, res);
    return successResponse(res, 200, "Todo berhasil dihapus", deleteTodo);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const restoreTodo = async (req, res) => {
  try {
    const restoredTodo = await todoService.restoreTodo(req, res);
    return successResponse(res, 200, "Todo berhasil dipulihkan", restoredTodo);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
