import 'dotenv/config';
import express from "express";
import morgan from "morgan";
import { homepage, apiList, info } from "./pages/index.js";
import data from "./data.js";
import { Contact } from './models/contact.js'

let persons = data.persons;

const port = process.env.PORT;
const app = express();

morgan.token("content", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens["content"](req, res),
    ].join(" ");
  })
);
app.use(express.static('dist'));

app.get("/api", (req, res) => {
  res.send(apiList);
});

app.get("/api/persons", (req, res) => {
    Contact.find({}).then(contacts => {
    res.json(contacts);
  })
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  Contact.findById(id).then(contact => {
    res.json(contact)
  }).catch(error => {
    console.error(error);
    res.status(404).end();
  })
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
