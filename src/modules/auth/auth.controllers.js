import { errorResponse, successResponse } from "../../utils/response.js";
import * as authService from "./auth.services.js";

export const register = async (req, res) => {
  try {
    const user = await authService.userRegister(req.body);
    return successResponse(res, 201, "User registered successfully", user);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { token, user } = await authService.userLogin(req.body);
    return successResponse(res, 200, "Login berhasil", { token, user });
  } catch (error) {
    return errorResponse(res, (message = error));
  }
};
