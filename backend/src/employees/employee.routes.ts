import { Router } from "express";
import {
  createEmployeeController,
  deleteEmployeeController,
  getEmployee,
  getEmployees,
} from "./employee.controller.js";

const employeeRouter = Router();

employeeRouter.get("/", getEmployees);
employeeRouter.get("/:id", getEmployee);
employeeRouter.post("/", createEmployeeController);
employeeRouter.delete("/:id", deleteEmployeeController);

export { employeeRouter };
