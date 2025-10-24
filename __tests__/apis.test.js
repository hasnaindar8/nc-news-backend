const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  it("status:200, responds with topics array of topic objects", () => {
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
  it("status:200, responds with users array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("users");
        expect(body["users"]).toBeInstanceOf(Array);
        expect(body["users"].length).toBe(4);
        body["users"].forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
          expect(typeof user["username"]).toBe("string");
          expect(typeof user["name"]).toBe("string");
          expect(typeof user["avatar_url"]).toBe("string");
        });
      });
  });
});

describe("GET /api/articles", () => {
  it("status:200, responds with articles array of user article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("articles");
        expect(body["articles"]).toBeInstanceOf(Array);
        expect(body["articles"].length).toBe(13);
        body["articles"].forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).not.toHaveProperty("body");
          expect(typeof article["author"]).toBe("string");
          expect(typeof article["title"]).toBe("string");
          expect(typeof article["article_id"]).toBe("number");
          expect(typeof article["topic"]).toBe("string");
          expect(typeof article["created_at"]).toBe("string");
          expect(typeof article["votes"]).toBe("number");
          expect(typeof article["article_img_url"]).toBe("string");
          expect(typeof article["comment_count"]).toBe("number");
        });
        expect(body["articles"]).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe.only("GET /api/articles/:article_id", () => {
  it("status:200, responds with article object", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("article");
        const article = body["article"];
        expect(article).toBeInstanceOf(Object);
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
        expect(typeof article["author"]).toBe("string");
        expect(typeof article["title"]).toBe("string");
        expect(typeof article["article_id"]).toBe("number");
        expect(typeof article["body"]).toBe("string");
        expect(typeof article["topic"]).toBe("string");
        expect(typeof article["created_at"]).toBe("string");
        expect(typeof article["votes"]).toBe("number");
        expect(typeof article["article_img_url"]).toBe("string");
      });
  });
  it("status:404, responds with an error message when passed a valid article ID that does not exist", () => {
    return request(app)
      .get("/api/articles/15")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found for article_id: 15");
      });
  });
  it("status:400, responds with an error message when passed a not valid article ID", () => {
    return request(app)
      .get("/api/articles/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
