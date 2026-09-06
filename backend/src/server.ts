import express from "express";
import { employeeRouter } from "./employees/employee.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("MiniShift API");
});

app.use("/employees", employeeRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
