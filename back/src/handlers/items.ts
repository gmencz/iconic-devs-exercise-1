import { Handler } from "express";
import { items } from "../data";

// GET /items
export const itemsHandler: Handler = (_req, res) => {
  return res.json({ items });
};
