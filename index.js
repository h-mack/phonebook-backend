import express from "express";
import { homepage, apiList, info } from "./pages/index.js";
import data from "./data.js";

let persons = data.persons;

const app = express();
const port = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(homepage);
});

app.get("/api", (req, res) => {
  res.send(apiList);
});

app.get("/api/persons", (req, res) => {
  res.send(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);
  if (person) {
    res.send(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: "number missing",
    });
  }

  if (persons.some((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const id = String(Math.round(Math.random() * 1000));
  const person = {
    id: id,
    name: body.name,
    number: body.number,
  };
  persons = [...persons, person];

  res.json(person);
});

app.get("/info", (req, res) => {
  res.send(info);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
