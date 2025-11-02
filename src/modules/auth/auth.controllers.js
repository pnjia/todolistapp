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
    const { refreshToken, accessToken, user } = await authService.userLogin(
      req.body,
      res
    );
    return successResponse(res, 200, "Login berhasil", {
      refreshToken,
      accessToken,
      user,
    });
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const logout = async (req, res) => {
  try {
    const logout = await authService.userLogout(req, res);

    if (logout) return successResponse(res, 200, "Logout berhasil");
  } catch (error) {
    return errorResponse(res, 400, error.message || "Gagal logout");
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken, accessToken } = await authService.refresh(req, res);
    return successResponse(res, 200, "Token refreshed successfully", {
      refreshToken,
      accessToken,
    });
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};
