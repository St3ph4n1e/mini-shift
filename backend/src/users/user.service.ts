import bcrypt from "bcrypt";
import { AppError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";

export type CreateUserData = {
  email: string;
  password: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
  employeeId?: number;
};

export type UpdateUserData = {
  email?: string;
  password?: string;
  role?: "ADMIN" | "MANAGER" | "EMPLOYEE";
  employeeId?: number | null;
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

export async function getAllUsers() {
  const users = await prisma.user.findMany({
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      email: true,
      role: true,
      employeeId: true,
      employee: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return users;
}

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      employeeId: true,
      employee: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return user;
}

export async function updateUser(id: number, data: UpdateUserData) {
  const currentUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!currentUser) {
    throw new AppError(404, "User not found");
  }

  const nextRole = data.role ?? currentUser.role;

  const nextEmployeeId =
    data.employeeId !== undefined ? data.employeeId : currentUser.employeeId;

  if (
    (nextRole === "MANAGER" || nextRole === "EMPLOYEE") &&
    nextEmployeeId === null
  ) {
    throw new AppError(400, `${nextRole} user must be linked to an employee`);
  }

  if (nextEmployeeId !== null) {
    const employee = await prisma.employee.findUnique({
      where: {
        id: nextEmployeeId,
      },
    });

    if (!employee) {
      throw new AppError(404, "Employee not found");
    }
  }

  const updateData: {
    email?: string;
    passwordHash?: string;
    role: "ADMIN" | "MANAGER" | "EMPLOYEE";
    employeeId: number | null;
  } = {
    role: nextRole,
    employeeId: nextEmployeeId,
  };

  if (data.email !== undefined) {
    updateData.email = data.email;
  }

  if (data.password !== undefined) {
    updateData.passwordHash = await bcrypt.hash(data.password, 12);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,

    select: {
      id: true,
      email: true,
      role: true,
      employeeId: true,
      employee: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return user;
}

export async function deleteUser(id: number) {
  await prisma.user.delete({
    where: { id },
  });
}
