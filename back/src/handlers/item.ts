import { Handler } from "express";
import { items } from "../data";
import { isLetters } from "../utils/strings";

// GET /item/:letter
export const itemHandler: Handler = (req, res) => {
  const letter = req.params?.letter;
  if (!letter) {
    return res.status(400).json({ message: "Missing letter parameter" });
  }

  // Make sure the user input is valid.
  if (!isLetters(letter)) {
    return res.status(400).json({ message: "Invalid letter parameter" });
  }

  // We convert the letter to lower case so that the query is case insensitive.
  const searchableLetter = letter.toLowerCase();
  const item = items.find(
    (item) => item.letter.toLowerCase() === searchableLetter
  );

  if (!item) {
    return res
      .status(404)
      .json({ message: `Item with letter ${letter} not found` });
  }

  return res.json({ item });
};
