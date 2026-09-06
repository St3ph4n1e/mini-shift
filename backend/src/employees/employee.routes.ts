import { Router } from "express";
import {
  addPositionToEmployeeController,
  createEmployeeController,
  deleteEmployeeController,
  getEmployee,
  getEmployees,
  updateEmployeeController,
} from "./employee.controller.js";

const employeeRouter = Router();

employeeRouter.get("/", getEmployees);
employeeRouter.get("/:id", getEmployee);
employeeRouter.post("/", createEmployeeController);
employeeRouter.delete("/:id", deleteEmployeeController);
employeeRouter.patch("/:id", updateEmployeeController);
employeeRouter.post("/:id/positions", addPositionToEmployeeController);

export { employeeRouter };
