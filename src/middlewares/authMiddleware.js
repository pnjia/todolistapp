import { verifyToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, 401, "Token tidak ditemukan");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 401, "Token tidak valid atau expired");
  }
};
