import { type Request, type Response } from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  type UpdateUserData,
} from "./user.service.js";

const allowedRoles = ["ADMIN", "MANAGER", "EMPLOYEE"];

export async function createUserController(req: Request, res: Response) {
  const { email, password, role, employeeId } = req.body;

  const isRoleValid = allowedRoles.includes(role);

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

  if ((role === "EMPLOYEE" || role === "MANAGER") && employeeId === undefined) {
    return res.status(400).json({
      message: `${role} user must be linked to an employee`,
    });
  }

  const currentUser = res.locals.user;

  if (currentUser.role === "MANAGER" && role !== "EMPLOYEE") {
    return res.status(403).json({
      message: "Forbidden",
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

export async function getUsers(_req: Request, res: Response) {
  const users = await getAllUsers();

  res.json(users);
}

export async function getUserController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = parseInt(req.params.id);

  const user = await getUserById(id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json(user);
}

export async function updateUserController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = parseInt(req.params.id);

  const { email, password, role, employeeId } = req.body;

  if (
    email === undefined &&
    password === undefined &&
    role === undefined &&
    employeeId === undefined
  ) {
    return res.status(400).json({
      message: "At least one field is required",
    });
  }

  if (
    email !== undefined &&
    (typeof email !== "string" || email.trim() === "")
  ) {
    return res.status(400).json({
      message: "Invalid email",
    });
  }

  if (
    password !== undefined &&
    (typeof password !== "string" || password.length === 0)
  ) {
    return res.status(400).json({
      message: "Invalid password",
    });
  }

  if (role !== undefined && !allowedRoles.includes(role)) {
    return res.status(400).json({
      message: "Invalid role",
    });
  }

  if (
    employeeId !== undefined &&
    employeeId !== null &&
    (typeof employeeId !== "number" ||
      !Number.isInteger(employeeId) ||
      employeeId <= 0)
  ) {
    return res.status(400).json({
      message: "employeeId must be a positive integer or null",
    });
  }

  const updateData: UpdateUserData = {};

  if (email !== undefined) {
    updateData.email = email.trim();
  }

  if (password !== undefined) {
    updateData.password = password;
  }

  if (role !== undefined) {
    updateData.role = role;
  }

  if (employeeId !== undefined) {
    updateData.employeeId = employeeId;
  }

  const user = await updateUser(id, updateData);

  res.status(200).json(user);
}

export async function deleteUserController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = parseInt(req.params.id);

  await deleteUser(id);

  res.status(204).send();
}
