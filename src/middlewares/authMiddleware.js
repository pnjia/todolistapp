import { verifyAccessToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token)
    return res
      .status(401)
      .json({ message: "Token tidak ditemukan, akses ditolak" });

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(
      res,
      401,
      "Access token expired, silahkan login kembali"
    );
  }
};
