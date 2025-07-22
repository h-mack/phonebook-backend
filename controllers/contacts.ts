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
    const contact = new Contact({ name, number });
    const savedContact = await contact.save();
    response.json(savedContact);
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
    const contact = await Contact.findById(request.params.id);

    if (!contact) {
      return response.status(404).end();
    }

    contact.name = name;
    contact.number = number;

    const updatedContact = await contact.save();
    response.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

export default contactsRouter;
