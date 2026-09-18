import { describe, expect, jest, test } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/app-error.js";
import { errorHandler } from "./error.middleware.js";

describe("errorHandler", () => {
  test("returns the AppError status code and message", () => {
    // Arrange
    const req = {} as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as unknown as NextFunction;

    const error = new AppError(409, "Conflict");

    // Act
    errorHandler(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Conflict",
    });
  });
});
