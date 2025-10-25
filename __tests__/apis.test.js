const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("Unknown Paths", () => {
  it("responds with 404 for unknown paths", () => {
    return request(app)
      .get("/this-path-does-not-exist")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

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
  it("status:200, responds with articles array of article object", () => {
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

describe("GET /api/articles/:article_id", () => {
  it("status:200, responds with article object", () => {
    const articleId = 5;
    return request(app)
      .get(`/api/articles/${articleId}`)
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
        expect(article["article_id"]).toBe(articleId);
      });
  });
  it("status:200, responds with article object and additional property comment_count with correct count", () => {
    const articleId = 5;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("article");
        const article = body["article"];
        expect(article).toBeInstanceOf(Object);
        expect(article).toHaveProperty("comment_count");
        expect(typeof article["comment_count"]).toBe("number");
        expect(article["comment_count"]).toBe(2);
      });
  });
  it("status:404, responds with an error message when passed a valid article_id that does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found for article_id: 9999");
      });
  });
  it("status:400, responds with an error message when passed an invalid article_id type", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("status:200, responds with an array of comments for the given article_id ordered by created_at desc", () => {
    const articleId = 1;
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("comments");
        expect(body["comments"]).toBeInstanceOf(Array);
        expect(body["comments"].length).toBe(11);
        body["comments"].forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
          expect(typeof comment["comment_id"]).toBe("number");
          expect(typeof comment["votes"]).toBe("number");
          expect(typeof comment["created_at"]).toBe("string");
          expect(typeof comment["author"]).toBe("string");
          expect(typeof comment["body"]).toBe("string");
          expect(typeof comment["article_id"]).toBe("number");
          expect(comment["article_id"]).toBe(articleId);
        });
        expect(body["comments"]).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("status:200, responds with an empty array if article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/8/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("comments");
        expect(body["comments"]).toBeInstanceOf(Array);
        expect(body["comments"]).toEqual([]);
      });
  });
  it("status:404, responds with an error message when passed a valid article_id that does not exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found for article_id: 9999");
      });
  });
  it("status:400, responds with an error message when passed an invalid article_id type", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  const validComment = {
    username: "butter_bridge",
    body: "This article changed my life.",
  };
  it("status:201, responds with an object of posted comment", () => {
    const articleId = 12;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(validComment)
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty("comment");
        const comment = body["comment"];
        expect(comment).toBeInstanceOf(Object);
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("article_id");
        expect(comment).toHaveProperty("body");
        expect(comment).toHaveProperty("votes");
        expect(comment).toHaveProperty("author");
        expect(comment).toHaveProperty("created_at");
        expect(typeof comment["comment_id"]).toBe("number");
        expect(typeof comment["article_id"]).toBe("number");
        expect(typeof comment["body"]).toBe("string");
        expect(typeof comment["votes"]).toBe("number");
        expect(typeof comment["author"]).toBe("string");
        expect(typeof comment["created_at"]).toBe("string");
        expect(comment["article_id"]).toBe(articleId);
        expect(comment["author"]).toBe(validComment.username);
        expect(comment["body"]).toBe(validComment.body);
      });
  });
  it("status:404, responds with an error message when passed a valid article_id that does not exist", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send(validComment)
      .expect(409)
      .then(({ body }) => {
        expect(body.msg).toBe("Referenced record does not exist");
      });
  });
  it("status:404, responds with an error message when passed username does not exist", () => {
    const articleId = 12;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send({ username: "mystery", body: "This article changed my life." })
      .expect(409)
      .then(({ body }) => {
        expect(body.msg).toBe("Referenced record does not exist");
      });
  });
  it("status:400, responds with an error message when passed an invalid article_id type", () => {
    return request(app)
      .post("/api/articles/not-an-id/comments")
      .send(validComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("status:400, responds with an error message if required fields are missing", async () => {
    const articleId = 12;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("status:400, responds with an error message if request body has wrong data types", async () => {
    const articleId = 12;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send({ username: "butter_bridge", body: {} })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("status:400, responds with an error message if empty string in comment body", async () => {
    const articleId = 12;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send({ username: "butter_bridge", body: "" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  const validRequestBody = {
    inc_votes: 1,
  };
  it("status 200, responds with updated article object", () => {
    const articleId = 1;
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(validRequestBody)
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
        expect(article["article_id"]).toBe(articleId);
      });
  });
  it("status:404, responds with an error message when passed a valid article_id that does not exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send(validRequestBody)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found for article_id: 9999");
      });
  });
  it("status:400, responds with an error message when passed an invalid article_id type", () => {
    return request(app)
      .patch("/api/articles/not-an-id")
      .send(validRequestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("status:400, responds with an error message if required fields are missing", async () => {
    const articleId = 12;
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("status:400, responds with an error message if request body has wrong data types", async () => {
    const articleId = 1;
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send({ inc_votes: "1" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("status:204, responds with no content", () => {
    return request(app)
      .delete("/api/comments/5")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  it("status:404, responds with error message when passed a valid comment_id that does not exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg");
        expect(body["msg"]).toBe(
          "No comment found to delete with comment_id: 9999"
        );
      });
  });
  it("status:400, responds with error message when passed an invalid comment_id type", () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg");
        expect(body["msg"]).toBe("Bad Request");
      });
  });
});
