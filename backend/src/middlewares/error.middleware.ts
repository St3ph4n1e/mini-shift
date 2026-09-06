import { type NextFunction, type Request, type Response } from "express";

import { AppError } from "../errors/app-error.js";
import { Prisma } from "../generated/prisma/client.js";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return res.status(404).json({
      message: "Resource not found",
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Internal server error",
  });
}
