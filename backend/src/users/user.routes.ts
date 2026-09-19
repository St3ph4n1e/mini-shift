import { Router } from "express";

import { authenticate, authorize } from "../auth/auth.middleware.js";
import {
  createUserController,
  deleteUserController,
  getUserController,
  getUsers,
  updateUserController,
} from "./user.controller.js";

const userRouter = Router();

userRouter.post(
  "/",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  createUserController,
);

userRouter.get("/", authenticate, authorize("ADMIN"), getUsers);
userRouter.get("/:id", authenticate, authorize("ADMIN"), getUserController);
userRouter.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateUserController,
);
userRouter.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteUserController,
);

export { userRouter };
