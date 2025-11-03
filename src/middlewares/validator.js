import { validationResult } from "express-validator";
import { errorResponse } from "../utils/response.js";

export const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log({ errorValidation: errors.array().map((err) => err.msg) });
    return errorResponse(
      res,
      400,
      "Validation Error",
      errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      }))
    );
  }
  next();
};
