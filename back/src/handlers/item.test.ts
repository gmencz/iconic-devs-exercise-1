import request from "supertest";
import { Express } from "express-serve-static-core";
import { createServer } from "../server";
import { items } from "../data";

let server: Express;

beforeAll(() => {
  server = createServer();
});

describe("GET /items/:letter", () => {
  test("responds with the correct item", async () => {
    const letter = "A";
    const item = items.find((item) => item.letter === letter);
    if (!item) {
      throw new Error(`Item with letter ${letter} not found`);
    }

    const response = await request(server).get(`/items/${letter}`);
    expect(response.status).toEqual(200);
    expect(response.body.item.letter).toEqual(letter);
  });

  test("responds with a 404 if the item is not found", async () => {
    const letter = "KEDM";
    const response = await request(server).get(`/items/${letter}`);
    expect(response.status).toEqual(404);
  });

  test("validates letter", async () => {
    const letter = "123";
    const response = await request(server).get(`/items/${letter}`);
    expect(response.status).toEqual(400);
  });
});
