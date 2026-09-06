import { prisma } from "../lib/prisma.js";

export async function getAllEmployees() {
  const employees = await prisma.employee.findMany();

  return employees;
}

export async function getEmployeeById(id: number) {
  const employee = await prisma.employee.findUnique({
    where: { id },
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
