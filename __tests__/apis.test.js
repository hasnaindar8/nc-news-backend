const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  it("returns all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((res) => {
        const body = res.body;
        expect(body).toHaveProperty("topics");
        expect(body["topics"]).toBeInstanceOf(Array);
        expect(body["topics"].length).toBe(3);
        expect(body["topics"][0]).toHaveProperty("slug");
        expect(body["topics"][0]).toHaveProperty("description");
        expect(body["topics"]).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              slug: "mitch",
              description: "The man, the Mitch, the legend",
            }),
            expect.objectContaining({
              slug: "cats",
              description: "Not dogs",
            }),
            expect.objectContaining({
              slug: "paper",
              description: "what books are made of",
            }),
          ])
        );
      });
  });
});
