import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_ACCESS_SECRET } from "../config/env.js";

export const generateAccessToken = (payload, expiresIn = "15m") => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn });
};

export const generateRefreshToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};
