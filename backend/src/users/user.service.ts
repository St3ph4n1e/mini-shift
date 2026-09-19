import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";

export type CreateUserData = {
  email: string;
  password: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
  employeeId?: number;
};

export async function createUser(data: CreateUserData) {
  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      role: data.role,
      employeeId: data.employeeId ?? null,
    },
    select: {
      id: true,
      email: true,
      role: true,
      employeeId: true,
    },
  });

  return user;
}
