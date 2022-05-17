import { Express } from "express-serve-static-core";
import request from "supertest";
import { createServer } from "../server";

let server: Express;

beforeAll(() => {
  server = createServer();
});

describe("GET /", () => {
  test("responds with the expected message", async () => {
    const response = await request(server).get(`/`);
    expect(response.status).toEqual(200);
    expect(response.body.message).toMatchInlineSnapshot(`"Iconic Devs Exercise 1 by Gabriel Mendez"`);
  });
});
