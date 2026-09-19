import bcrypt from "bcrypt";
import { AppError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";

export type CreateUserData = {
  email: string;
  password: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
  employeeId?: number;
};

export async function createUser(data: CreateUserData) {
  if (data.employeeId !== undefined) {
    const employee = await prisma.employee.findUnique({
      where: {
        id: data.employeeId,
      },
    });

    if (!employee) {
      throw new AppError(404, "Employee not found");
    }
  }
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
