import { errorResponse } from "../utils/response.js";

export const userMiddleware = (req, res, next) => {
  try {
    const userId = req.user?.id;
    console.log({ userId });
    if (!userId) {
      return errorResponse(res, 401, "Unauthorized", "User ID not found");
    }
    next();
  } catch (error) {
    return errorResponse(res, 500, "Internal Server Error", error.message);
  }
};
