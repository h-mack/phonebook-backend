import express from "express";
import { homepage, apiList, info } from "./pages/index.js";
import { data } from "./data.js";

const app = express();
const port = 3001;

app.get("/", (req, res) => {
  res.send(homepage);
});

app.get("/api", (req, res) => {
  res.send(apiList);
});

app.get("/api/persons", (req, res) => {
  res.send(data);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = data.find((p) => p.id === id);
  if (person) {
    res.send(person);
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  res.send(info);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
