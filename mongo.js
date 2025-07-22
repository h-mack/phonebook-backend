import mongoose from "mongoose";

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@cluster0.bkygwix.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

if ((process.argv.length < 3) | (process.argv.length > 5)) {
  console.log(`Please provide either:
        (a) just your password to view the list of saved contacts
        (b) your password, contact name and contact number of the contact you wish to save`);
  process.exit(1);
}

if (process.argv.length === 4) {
  console.log("Please provide a contact number as well as a contact name");
  process.exit(1);
}

mongoose.set("strictQuery", false);

mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

const contact = new Contact({
  name: name,
  number: number,
});

if (process.argv.length === 3) {
  Contact.find({})
    .then((result) => {
      result.forEach((contact) => {
        console.log(contact);
      });
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => mongoose.connection.close());
}

if (process.argv.length === 5) {
  contact
    .save()
    .then((result) => {
      console.log("Contact saved!");
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => mongoose.connection.close());
}
