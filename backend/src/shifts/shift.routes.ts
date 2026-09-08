import { Router } from "express";
import {
  createShiftController,
  deleteShiftController,
  getShiftController,
  getShiftsController,
  updateShiftController,
} from "./shift.controller.js";

const shiftRouter = Router();

shiftRouter.post("/", createShiftController);
shiftRouter.get("/", getShiftsController);
shiftRouter.get("/:id", getShiftController);
shiftRouter.delete("/:id", deleteShiftController);
shiftRouter.patch("/:id", updateShiftController);

export { shiftRouter };
