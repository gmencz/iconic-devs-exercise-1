import { Handler } from "express";

// GET /
export const slashHandler: Handler = (_req, res) => {
  return res.json({ message: "Iconic Devs Exercise 1 by Gabriel Mendez" });
};
