import express from "express";
import { prisma } from "./lib/prisma.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("MiniShift API");
});

app.get("/employees", async (req, res) => {
  const employees = await prisma.employee.findMany();
  res.json(employees);
});

app.get("/employees/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    return res.status(404).json({
      message: "Employee not found",
    });
  }

  res.json(employee);
});

app.post("/employees", async (req, res) => {
  const { name, role } = req.body;

  if (
    typeof name !== "string" ||
    typeof role !== "string" ||
    !name.trim() ||
    !role.trim()
  ) {
    return res.status(400).json({
      message: "Name and role are required",
    });
  }

  const employee = await prisma.employee.create({
    data: {
      name: name,
      role: role,
    },
  });

  res.status(201).json(employee);
});

app.delete("/employees/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.employee.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    return res.status(404).json({
      message: "Employee not found",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
