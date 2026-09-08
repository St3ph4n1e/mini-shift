import { type Request, type Response } from "express";
import {
  createShift,
  deleteShift,
  getAllShifts,
  getShiftById,
  updateShift,
  type UpdateShiftData,
} from "./shift.service.js";

export async function createShiftController(req: Request, res: Response) {
  const { startAt, endAt, location, positionId, employeeId } = req.body;

  if (
    typeof startAt !== "string" ||
    typeof endAt !== "string" ||
    typeof positionId !== "number" ||
    (location !== undefined &&
      (typeof location !== "string" || location.trim() === "")) ||
    (employeeId !== undefined && typeof employeeId !== "number")
  ) {
    return res.status(400).json({
      message: "Invalid shift data",
    });
  }

  const startDate = new Date(startAt);
  const endDate = new Date(endAt);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return res.status(400).json({
      message: "Invalid dates",
    });
  }

  if (endDate.getTime() <= startDate.getTime()) {
    return res.status(400).json({
      message: "End date must be after start date",
    });
  }

  const shift = await createShift({
    startAt: startDate,
    endAt: endDate,
    location: location?.trim(),
    positionId,
    employeeId,
  });

  res.status(201).json(shift);
}

export async function getShiftsController(req: Request, res: Response) {
  const shifts = await getAllShifts();

  res.status(200).json(shifts);
}

export async function getShiftController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = parseInt(req.params.id);

  const shift = await getShiftById(id);

  if (!shift) {
    return res.status(404).json({
      message: "Shift not found",
    });
  }

  res.status(200).json(shift);
}

export async function deleteShiftController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = parseInt(req.params.id);

  await deleteShift(id);

  res.status(204).send();
}

export async function updateShiftController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = parseInt(req.params.id);

  const { startAt, endAt, location, positionId, employeeId } = req.body;

  if (
    startAt === undefined &&
    endAt === undefined &&
    location === undefined &&
    positionId === undefined &&
    employeeId === undefined
  ) {
    return res.status(400).json({
      message: "At least one field is required",
    });
  }

  if (
    (startAt !== undefined && typeof startAt !== "string") ||
    (endAt !== undefined && typeof endAt !== "string") ||
    (location !== undefined &&
      location !== null &&
      (typeof location !== "string" || location.trim() === "")) ||
    (positionId !== undefined && typeof positionId !== "number") ||
    (employeeId !== undefined &&
      employeeId !== null &&
      typeof employeeId !== "number")
  ) {
    return res.status(400).json({
      message: "Invalid shift data",
    });
  }

  const updateData: UpdateShiftData = {};

  if (location !== undefined) {
    updateData.location = location;
  }

  if (positionId !== undefined) {
    updateData.positionId = positionId;
  }

  if (employeeId !== undefined) {
    updateData.employeeId = employeeId;
  }

  if (startAt !== undefined) {
    const startDate = new Date(startAt);

    if (Number.isNaN(startDate.getTime())) {
      return res.status(400).json({
        message: "Invalid start date",
      });
    }

    updateData.startAt = startDate;
  }

  if (endAt !== undefined) {
    const endDate = new Date(endAt);

    if (Number.isNaN(endDate.getTime())) {
      return res.status(400).json({
        message: "Invalid end date",
      });
    }

    updateData.endAt = endDate;
  }

  const shift = await updateShift(id, updateData);

  res.status(200).json(shift);
}
