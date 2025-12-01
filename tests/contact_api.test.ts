import { test, after, beforeEach } from "node:test";
import { strictEqual } from "node:assert";
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

beforeEach(async () => {
  await Contact.deleteMany({});
  let contactObject = new Contact(initialContacts[0]);
  await contactObject.save();
  contactObject = new Contact(initialContacts[1]);
  await contactObject.save();
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

test("a valid contact can be added", async () => {
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
  console.log(contacts);
  strictEqual(
    contacts.some((contact: typeof Contact) => contact.name === "Spider Man"),
    true,
  );
});

test("contact without name is not added", async () => {
  const newContact = {
    number: "999-888-777",
  };

  await api.post("/api/persons").send(newContact).expect(400);

  const response = await api.get("/api/persons");
  strictEqual(response.body.length, initialContacts.length);
});

test("contact without number is not added", async () => {
  const newContact = {
    name: "Mr No-number",
  };

  await api.post("/api/persons").send(newContact).expect(400);

  const response = await api.get("/api/persons");
  strictEqual(response.body.length, initialContacts.length);
});

after(async () => {
  await mongoose.connection.close();
});
