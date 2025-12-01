import mongoose from "mongoose";
import { MONGODB_URI } from "../utils/config";

mongoose.set("strictQuery", false);

const url = MONGODB_URI;

if (!url) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

console.log("connecting to", url);

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error);
  });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

export const Contact = mongoose.model("Contact", contactSchema);
