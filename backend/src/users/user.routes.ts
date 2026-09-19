import { Router } from "express";

import { authenticate, authorize } from "../auth/auth.middleware.js";
import { createUserController } from "./user.controller.js";

const userRouter = Router();

userRouter.post("/", authenticate, authorize("ADMIN"), createUserController);

export { userRouter };
