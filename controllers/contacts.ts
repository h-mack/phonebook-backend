import * as express from "express";
import { Contact } from "../models/contact";

const contactsRouter = express.Router();

contactsRouter.get("/", async (request, response, next) => {
  try {
    const contacts = await Contact.find({});
    response.json(contacts);
  } catch (error) {
    next(error);
  }
});

contactsRouter.get("/:id", async (request, response, next) => {
  try {
    const contact = await Contact.findById(request.params.id);
    if (contact) {
      response.json(contact);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

contactsRouter.post("/", async (request, response, next) => {
  try {
    const { name, number } = request.body;

    const errors: string[] = [];
    if (!name || typeof name !== "string" || name.trim() === "") {
      errors.push("name is required");
    }
    if (!number || typeof number !== "string" || number.trim() === "") {
      errors.push("number is required");
    }
    if (errors.length > 0) {
      return response.status(400).json({ errors });
    }

    const contact = new Contact({ name: name.trim(), number: number.trim() });
    const savedContact = await contact.save();
    response.status(201).json(savedContact);
  } catch (error) {
    next(error);
  }
});

contactsRouter.delete("/:id", async (request, response, next) => {
  try {
    await Contact.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

contactsRouter.put("/:id", async (request, response, next) => {
  try {
    const { name, number } = request.body;

    if (!name && !number) {
      return response
        .status(400)
        .json({ error: "either an updated name, number, or both is required" });
    }

    const contact = await Contact.findById(request.params.id);
    if (!contact) {
      return response.status(404).end();
    }

    const errors: string[] = [];
    if (name) {
      if (typeof name !== "string") {
        errors.push("name must be of type string");
      } else {
        if (name.trim() === "") {
          errors.push("name must not be an empty value");
        }
        if (name === contact.name) {
          errors.push("this contact already exists with that name value");
        }
      }
    }
    if (number) {
      if (typeof number !== "string") {
        errors.push("number must be of type string");
      } else {
        if (number.trim() === "") {
          errors.push("number must not be an empty value");
        }
        if (number === contact.number) {
          errors.push("this contact already exists with that number value");
        }
      }
    }
    if (errors.length > 0) {
      return response.status(400).json({ error: errors.join(", ") });
    }

    if (name) contact.name = name;
    if (number) contact.number = number;

    const updatedContact = await contact.save();
    response.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
});

export default contactsRouter;
