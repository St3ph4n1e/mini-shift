import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AppError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(401, "Invalid credentials");
  }

  const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordIsValid) {
    throw new AppError(401, "Invalid credentials");
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(
    {
      role: user.role,
    },
    jwtSecret,
    {
      subject: String(user.id),
      expiresIn: "1h",
    },
  );

  return {
    accessToken: token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    },
  };
}
