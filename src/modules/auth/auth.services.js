import prisma from "../../config/database.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { addToken } from "../../utils/tokenBlacklist.js";
import { errorResponse } from "../../utils/response.js";

export const userRegister = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email sudah terdaftar, gunakan email lain.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  const { password: _, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
};

export const userLogin = async ({ email, password }, res) => {
  const user = await prisma.user.findUnique({ where: { email } });

  console.log({ user });

  if (!user) {
    throw new Error("Email tidak ditemukan");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Password salah");
  }

  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export const userLogout = async (req, res) => {
  const refresh = req.cookies?.refreshToken;

  if (!refresh) {
    throw new Error("Refresh token tidak ditemukan");
  }

  console.log({ refresh });

  const user = await prisma.user.findFirst({
    where: { refreshToken: refresh },
  });

  if (!user) return res.status(401).json({ message: "Invalid token" });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: null },
  });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return true;
};

export const refresh = async (req, res) => {
  const refreshTokenCookie = req.cookies?.refreshToken;
  console.log({ refreshTokenCookie });
  const check = await prisma.user.findMany({
    select: { id: true, refreshToken: true },
  });
  console.log("DB:", check);

  const refreshTokenDatabase = await prisma.user.findFirst({
    where: { refreshToken: refreshTokenCookie },
  });

  console.log({ refreshTokenDatabase });

  if (!refreshTokenDatabase || !refreshTokenCookie) {
    throw new Error("Refresh token tidak ditemukan di database atau cookie");
  }

  const decoded = verifyRefreshToken(refreshTokenCookie);

  await prisma.user.update({
    where: { id: decoded.id },
    data: { refreshToken: null },
  });

  const newAccessToken = generateAccessToken({
    id: decoded.id,
    email: decoded.email,
  });

  const newRefreshToken = generateRefreshToken({
    id: decoded.id,
    email: decoded.email,
  });

  await prisma.user.update({
    where: { id: decoded.id },
    data: { refreshToken: newRefreshToken },
  });

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
