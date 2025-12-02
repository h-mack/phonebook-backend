import { test, after, beforeEach, describe } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";
import mongoose from "mongoose";
import supertest from "supertest";
import { app } from "../app";
import { Contact } from "../models/contact";

const api = supertest(app);

const initialContacts = [
  {
    name: "John Doe",
    number: "1234-5678",
  },
  {
    name: "Jane Smith",
    number: "4444-5555",
  },
];

describe("when there is initially some notes saved", () => {
  beforeEach(async () => {
    await Contact.deleteMany({});
    await Contact.insertMany(initialContacts);
  });

  test("contacts are returned as json", async () => {
    await api
      .get("/api/persons")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all contacts are returned", async () => {
    const response = await api.get("/api/persons");
    strictEqual(response.body.length, 2);
  });

  test("a specific contact is within the returned notes", async () => {
    const response = await api.get("/api/persons");
    const contactNames = response.body.map((e: { name: unknown }) => e.name);
    strictEqual(contactNames.includes("John Doe"), true);
  });

  describe("viewing a specific contact", () => {
    test("succeeds with a valid id", async () => {
      const contacts = await Contact.find({}).lean();
      const expected = {
        ...contacts[0],
        _id: contacts[0]._id.toString(),
      };

      const resultContact = await api
        .get(`/api/persons/${contacts[0]._id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      deepStrictEqual(resultContact.body, expected);
    });

    test("fails with status code 404 if contact does not exist", async () => {
      const contact = new Contact({ name: "Temp", number: "54321" });
      await contact.save();
      await contact.deleteOne();
      await api.get(`/api/persons/${contact._id}`).expect(404);
    });

    test("fails with status code 400 if id value is invalid", async () => {
      const invalidId = "abcde12345";
      await api.get(`/api/persons/${invalidId}`).expect(400);
    });

    test("fails with status code 400 if id type is invalid", async () => {
      const invalidId = 12345;
      await api.get(`/api/persons/${invalidId}`).expect(400);
    });
  });

  describe("addition of a new contact", () => {
    test("succeeds with valid data", async () => {
      const newContact = {
        name: "Spider Man",
        number: "(407) 224-1783",
      };

      await api
        .post("/api/persons")
        .send(newContact)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/persons");
      const contacts = response.body.map((e: typeof Contact) => e);
      strictEqual(response.body.length, initialContacts.length + 1);
      strictEqual(
        contacts.some(
          (contact: typeof Contact) => contact.name === "Spider Man",
        ),
        true,
      );
    });

    test("fails with status code 400 if name is not valid", async () => {
      const newContact = {
        number: "999-888-777",
      };

      await api.post("/api/persons").send(newContact).expect(400);

      const response = await api.get("/api/persons");
      strictEqual(response.body.length, initialContacts.length);
    });

    test("fails with status code 400 if number is not valid", async () => {
      const newContact = {
        name: "Mr No-number",
      };

      await api.post("/api/persons").send(newContact).expect(400);

      const response = await api.get("/api/persons");
      strictEqual(response.body.length, initialContacts.length);
    });
  });

  describe("deletion of a contact", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const contactsAtStart = await Contact.find({}).lean();
      const contactToDelete = contactsAtStart[0];

      await api.delete(`/api/persons/${contactToDelete._id}`).expect(204);

      const contactsAtEnd = await Contact.find({}).lean();

      const contacts = contactsAtEnd.map((c) => c.name);
      strictEqual(!contacts.includes(contactToDelete.name), true);

      strictEqual(contactsAtEnd.length, initialContacts.length - 1);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
