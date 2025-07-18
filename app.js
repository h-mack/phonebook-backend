import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { apiList, info } from "./pages/index.js";
import { Contact } from "./models/contact.js";
import mongoose from "mongoose";

const port = process.env.PORT;
export const app = express();

morgan.token("content", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.static("dist"));
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

app.get("/api", (req, res) => {
  res.send(apiList);
});

app.get("/api/persons", (req, res) => {
  Contact.find({}).then((contacts) => {
    res.json(contacts);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Contact.findById(id)
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", async (req, res) => {
  const id = req.params.id;
  const objectId = new mongoose.Types.ObjectId(id);

  const result = await Contact.deleteOne({ _id: objectId });

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "Contact not found" });
  }

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

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact
    .save()
    .then((result) => {
      console.log("contact saved");
      res.json(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(400);
    });

  // if (persons.some((person) => person.name === body.name)) {
  //   return res.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  // res.json(person);
});

app.get("/info", (req, res) => {
  res.send(info);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
