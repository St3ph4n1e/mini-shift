import express from "express";
import { employeeRouter } from "./employees/employee.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { shiftRouter } from "./shifts/shift.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("MiniShift API");
});

app.use("/employees", employeeRouter);

app.use("/shifts", shiftRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
