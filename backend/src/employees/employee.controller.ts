import { type Request, type Response } from "express";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
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

  try {
    await deleteEmployee(id);

    res.status(204).send();
  } catch (error) {
    return res.status(404).json({
      message: "Employee not found",
    });
  }
}
