import { type Request, type Response } from "express";
import { createShift, getAllShifts, getShiftById } from "./shift.service.js";

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
