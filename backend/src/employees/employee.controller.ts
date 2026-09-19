import { type Request, type Response } from "express";
import {
  addPositionToEmployee,
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from "./employee.service.js";

export async function getEmployees(_req: Request, res: Response) {
  const employees = await getAllEmployees();

  res.json(employees);
}

export async function getEmployee(req: Request<{ id: string }>, res: Response) {
  const id = parseInt(req.params.id);

  const employee = await getEmployeeById(id);

  if (!employee) {
    return res.status(404).json({
      message: "Employee not found",
    });
  }

  res.json(employee);
}

export async function createEmployeeController(req: Request, res: Response) {
  const { name, positionIds } = req.body;

  if (
    typeof name !== "string" ||
    name.trim() === "" ||
    !Array.isArray(positionIds) ||
    positionIds.length === 0 ||
    !positionIds.every(
      (id) => typeof id === "number" && Number.isInteger(id) && id > 0,
    )
  ) {
    return res.status(400).json({
      message: "Name and at least one valid position are required",
    });
  }

  const employee = await createEmployee(name.trim(), positionIds);

  res.status(201).json(employee);
}

export async function deleteEmployeeController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = parseInt(req.params.id);

  await deleteEmployee(id);

  res.status(204).send();
}

export async function updateEmployeeController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = parseInt(req.params.id);
  const { name } = req.body;

  if (name === undefined) {
    return res.status(400).json({
      message: "At least one field is required",
    });
  }

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message: "Invalid name",
    });
  }

  const employee = await updateEmployee(id, {
    name: name.trim(),
  });

  res.status(200).json(employee);
}

export async function addPositionToEmployeeController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = parseInt(req.params.id);
  const positionId = req.body?.positionId;

  if (
    typeof positionId !== "number" ||
    !Number.isInteger(positionId) ||
    positionId <= 0
  ) {
    return res.status(400).json({
      message: "positionId must be a positive integer",
    });
  }

  const positionUpdated = await addPositionToEmployee(id, positionId);

  res.status(200).json(positionUpdated);
}
