import { type Request, type Response } from "express";
import {
  addPositionToEmployee,
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from "./employee.service.js";

export async function getEmployees(req: Request, res: Response) {
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
  const { name, role } = req.body;

  if (
    typeof name !== "string" ||
    typeof role !== "string" ||
    !name.trim() ||
    !role.trim()
  ) {
    return res.status(400).json({
      message: "Name and role are required",
    });
  }

  const employee = await createEmployee(name, role);

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
  const data = req.body;

  if (data.name === undefined && data.role === undefined) {
    return res.status(400).json({
      message: "At least one field is required",
    });
  }

  if (
    (data.name !== undefined &&
      (typeof data.name !== "string" || data.name.trim() === "")) ||
    (data.role !== undefined &&
      (typeof data.role !== "string" || data.role.trim() === ""))
  ) {
    return res.status(400).json({
      message: "Invalid name or role",
    });
  }

  const employee = await updateEmployee(id, data);

  res.status(200).json(employee);
}

export async function addPositionToEmployeeController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = parseInt(req.params.id);
  const positionId = req.body?.positionId;

  if (typeof positionId !== "number") {
    return res.status(400).json({
      message: "positionId must be a number",
    });
  }

  const positionUpdated = await addPositionToEmployee(id, positionId);

  res.status(200).json(positionUpdated);
}
