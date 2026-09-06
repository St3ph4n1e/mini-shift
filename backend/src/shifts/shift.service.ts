import { AppError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";

export type CreateShiftData = {
  startAt: Date;
  endAt: Date;
  location?: string;
  positionId: number;
  employeeId?: number;
};

export async function createShift(data: CreateShiftData) {
  if (data.employeeId !== undefined) {
    const employee = await prisma.employee.findUnique({
      where: {
        id: data.employeeId,
      },
      include: {
        positions: true,
      },
    });

    if (!employee) {
      throw new AppError(404, "Employee not found");
    }

    const hasPosition = employee.positions.some(
      (position) => position.id === data.positionId,
    );

    if (!hasPosition) {
      throw new AppError(409, "Employee does not have the required position");
    }

    const overlappingShift = await prisma.shift.findFirst({
      where: {
        employeeId: data.employeeId,
        startAt: {
          lt: data.endAt,
        },
        endAt: {
          gt: data.startAt,
        },
      },
    });

    if (overlappingShift) {
      throw new AppError(409, "Employee already has an overlapping shift");
    }
  }

  const shift = await prisma.shift.create({
    data: {
      startAt: data.startAt,
      endAt: data.endAt,
      location: data.location ?? null,
      positionId: data.positionId,
      employeeId: data.employeeId ?? null,
    },
    include: {
      position: true,
      employee: true,
    },
  });

  return shift;
}

export async function getAllShifts() {
  const shifts = await prisma.shift.findMany({
    include: {
      position: true,
      employee: true,
    },
    orderBy: {
      startAt: "asc",
    },
  });

  return shifts;
}

export async function getShiftById(id: number) {
  const shift = await prisma.shift.findUnique({
    where: { id },
    include: {
      position: true,
      employee: true,
    },
  });

  return shift;
}
