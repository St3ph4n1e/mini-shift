import { type Request, type Response } from "express";

import { createUser } from "./user.service.js";

const allowedRoles = ["ADMIN", "MANAGER", "EMPLOYEE"];

export async function createUserController(req: Request, res: Response) {
  const { email, password, role, employeeId } = req.body;

  const isRoleValid = allowedRoles.includes(role);

  // validation ici
  if (
    typeof email !== "string" ||
    email.trim() === "" ||
    typeof password !== "string" ||
    password.length === 0
  ) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  if (!isRoleValid) {
    return res.status(400).json({
      message: "Please enter a valid role",
    });
  }

  if (
    employeeId !== undefined &&
    (typeof employeeId !== "number" ||
      !Number.isInteger(employeeId) ||
      employeeId <= 0)
  ) {
    return res.status(400).json({
      message: "employeeId must be a positive integer",
    });
  }

  if (role === "EMPLOYEE" && employeeId === undefined) {
    return res.status(400).json({
      message: "An EMPLOYEE user must be linked to an employee",
    });
  }

  const user = await createUser({
    email,
    password,
    role,
    employeeId,
  });

  res.status(201).json(user);
}
