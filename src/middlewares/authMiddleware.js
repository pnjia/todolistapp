import { verifyAccessToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";
import { isBlacklisted } from "../utils/tokenBlacklist.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token)
    return res
      .status(401)
      .json({ message: "Token tidak ditemukan, akses ditolak" });

  if (isBlacklisted(token)) {
    // Reject blacklisted tokens
    return errorResponse(res, 401, "Token tidak valid atau sudah logout");
  }

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
