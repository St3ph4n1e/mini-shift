import { prisma } from "../lib/prisma.js";

export async function getAllEmployees() {
  const employees = await prisma.employee.findMany({
    orderBy: {
      id: "asc",
    },
    include: {
      positions: true,
    },
  });

  return employees;
}

export async function getEmployeeById(id: number) {
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      positions: true,
    },
  });

  return employee;
}

export async function createEmployee(name: string, role: string) {
  const employee = await prisma.employee.create({
    data: {
      name,
      role,
    },
  });

  return employee;
}

export async function deleteEmployee(id: number) {
  await prisma.employee.delete({
    where: { id },
  });
}

export async function updateEmployee(
  id: number,
  data: {
    name?: string;
    role?: string;
  },
) {
  const updateEmployee = await prisma.employee.update({
    where: {
      id,
    },

    data,
  });
}

export async function addPositionToEmployee(
  employeeId: number,
  positionId: number,
) {
  const employee = await prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      positions: {
        connect: {
          id: positionId,
        },
      },
    },
    include: {
      positions: true,
    },
  });

  return employee;
}
