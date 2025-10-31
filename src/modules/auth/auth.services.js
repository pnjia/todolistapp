import prisma from "../../config/database.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt.js";

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

export const userLogin = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Email tidak ditemukan");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Password salah");
  }

  const token = generateToken({ id: user.id, email: user.email });

  console.log({ token });

  return { token, user: { id: user.id, name: user.name, email: user.email } };
};
