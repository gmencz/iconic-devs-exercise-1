import { Express } from "express-serve-static-core";
import request from "supertest";
import { items } from "../data";
import { createServer } from "../server";

let server: Express;

beforeAll(() => {
  server = createServer();
});

describe("GET /items", () => {
  test("responds with the items", async () => {
    const response = await request(server).get(`/items`);
    expect(response.status).toEqual(200);
    expect(response.body.items).toMatchObject(items);
  });
});
