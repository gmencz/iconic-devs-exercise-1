import express from "express";
import { join } from "path";
import { itemHandler } from "./handlers/item";
import { itemsHandler } from "./handlers/items";
import { slashHandler } from "./handlers/slash";

export const createServer = () => {
  const server = express();

  // Static files
  server.use(express.static(join(__dirname, "..", "public")));

  // The API uses JSON for the data interchange format so all endpoints will
  // respond with JSON.
  server.get("/", slashHandler);
  server.get("/items", itemsHandler);
  server.get("/items/:letter", itemHandler);

  return server;
};
