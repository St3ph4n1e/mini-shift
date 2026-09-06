import express from "express";

const app = express();

app.use(express.json());

const employees = [
  { id: 1, name: "Alice", role: "Manager" },
  { id: 2, name: "Bob", role: "Waiter" },
];

app.get("/", (req, res) => {
  res.send("MiniShift API");
});

app.get("/employees", (req, res) => {
  res.json(employees);
});

app.get("/employees/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const employee = employees.find((employee) => {
    return employee.id === id;
  });

  if (!employee) {
    return res.status(404).json({
      message: "Employee not found",
    });
  }

  res.json(employee);
});

app.post("/employees", (req, res) => {
  const { name, role } = req.body;
  const id = employees.length + 1;

  if (!name.trim() || !role.trim()) {
    return res.status(400).json({
      message: "Name and role are required",
    });
  }

  const newEmployee = {
    id: id,
    name,
    role,
  };

  employees.push(newEmployee);

  res.status(201).json(newEmployee);
});

app.delete("/employees/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = employees.findIndex((employee) => employee.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Employee not found",
    });
  }

  employees.splice(index, 1);

  res.status(204).send();
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
