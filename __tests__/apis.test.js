const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  it("200: responds with topics array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("topics");
        expect(body["topics"]).toBeInstanceOf(Array);
        expect(body["topics"].length).toBe(3);
        body["topics"].forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
          expect(typeof topic["slug"]).toBe("string");
          expect(typeof topic["description"]).toBe("string");
        });
      });
  });
});

describe("GET /api/users", () => {
  it("returns all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((res) => {
        const body = res.body;
        expect(body).toHaveProperty("users");
        expect(body["users"]).toBeInstanceOf(Array);
        expect(body["users"].length).toBe(4);
        expect(body["users"][0]).toHaveProperty("username");
        expect(body["users"][0]).toHaveProperty("name");
        expect(body["users"][0]).toHaveProperty("avatar_url");
        expect(body["users"]).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              username: "butter_bridge",
              name: "jonny",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            }),
            expect.objectContaining({
              username: "icellusedkars",
              name: "sam",
              avatar_url:
                "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
            }),
            expect.objectContaining({
              username: "rogersop",
              name: "paul",
              avatar_url:
                "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
            }),
            expect.objectContaining({
              username: "lurker",
              name: "do_nothing",
              avatar_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            }),
          ])
        );
      });
  });
});
