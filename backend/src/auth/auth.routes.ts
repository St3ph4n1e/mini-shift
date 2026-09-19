import { Router } from "express";
import {
  getCurrentUserController,
  loginController,
} from "./auth.controller.js";
import { authenticate } from "./auth.middleware.js";

const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.get("/me", authenticate, getCurrentUserController);

export { authRouter };
