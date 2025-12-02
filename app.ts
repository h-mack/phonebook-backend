import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { apiList } from "./pages/index";
import { errorHandler, unknownEndpoint } from "./utils/middleware";
import contactsRouter from "./controllers/contacts";

const app = express();

morgan.token("content", function (req) {
  return JSON.stringify((req as express.Request).body);
});

app.use(express.static("dist"));
app.use(express.json());
// # Enable to show API call console logging info
// app.use(
//   morgan((tokens, req, res) => {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, "content-length"),
//       "-",
//       tokens["response-time"](req, res),
//       "ms",
//       tokens["content"](req, res),
//     ].join(" ");
//   }),
// );

app.get("/api", (_req, res) => {
  res.send(apiList);
});

app.use("/api/persons", contactsRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

export { app };
