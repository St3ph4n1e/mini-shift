import { Router } from "express";
import {
  createShiftController,
  getShiftController,
  getShiftsController,
} from "./shift.controller.js";

const shiftRouter = Router();

shiftRouter.post("/", createShiftController);
shiftRouter.get("/", getShiftsController);
shiftRouter.get("/:id", getShiftController);

export { shiftRouter };
