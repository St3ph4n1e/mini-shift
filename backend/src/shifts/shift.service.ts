import { AppError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";

export type CreateShiftData = {
  startAt: Date;
  endAt: Date;
  location?: string;
  positionId: number;
  employeeId?: number;
};

export type UpdateShiftData = {
  startAt?: Date;
  endAt?: Date;
  location?: string | null;
  positionId?: number;
  employeeId?: number | null;
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

export async function deleteShift(id: number) {
  await prisma.shift.delete({
    where: { id },
  });
}
export async function updateShift(id: number, data: UpdateShiftData) {
  const currentShift = await prisma.shift.findUnique({
    where: { id },
  });

  if (!currentShift) {
    throw new AppError(404, "Shift not found");
  }

  const nextStartAt = data.startAt ?? currentShift.startAt;
  const nextEndAt = data.endAt ?? currentShift.endAt;
  const nextPositionId = data.positionId ?? currentShift.positionId;
  const nextEmployeeId =
    data.employeeId !== undefined ? data.employeeId : currentShift.employeeId;

  if (nextEndAt.getTime() <= nextStartAt.getTime()) {
    throw new AppError(400, "End date must be after start date");
  }

  if (nextEmployeeId !== null) {
    const employee = await prisma.employee.findUnique({
      where: {
        id: nextEmployeeId,
      },
      include: {
        positions: true,
      },
    });

    if (!employee) {
      throw new AppError(404, "Employee not found");
    }

    const hasPosition = employee.positions.some(
      (position) => position.id === nextPositionId,
    );

    if (!hasPosition) {
      throw new AppError(409, "Employee does not have the required position");
    }

    const overlappingShift = await prisma.shift.findFirst({
      where: {
        employeeId: nextEmployeeId,

        id: {
          not: id,
        },

        startAt: {
          lt: nextEndAt,
        },

        endAt: {
          gt: nextStartAt,
        },
      },
    });

    if (overlappingShift) {
      throw new AppError(409, "Employee already has an overlapping shift");
    }
  }
  const shift = await prisma.shift.update({
    where: { id },
    data: {
      startAt: nextStartAt,
      endAt: nextEndAt,
      positionId: nextPositionId,
      employeeId: nextEmployeeId,
      location:
        data.location !== undefined ? data.location : currentShift.location,
    },
    include: {
      position: true,
      employee: true,
    },
  });

  return shift;
}
