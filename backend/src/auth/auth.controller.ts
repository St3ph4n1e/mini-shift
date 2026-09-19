import { type Request, type Response } from "express";
import { login } from "./auth.service.js";

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await login(email, password);

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

  res.status(200).json(result);
}

export async function getCurrentUserController(_req: Request, res: Response) {
  res.json(res.locals.user);
}
