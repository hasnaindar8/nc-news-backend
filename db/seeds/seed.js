const db = require("../connection");
const { format } = require("node-pg-format");
const { convertTimestampToDate, createLookupObject } = require("../seeds/utils.js");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  try {
    await db.query("DROP TABLE IF EXISTS comments;");
    await db.query("DROP TABLE IF EXISTS articles;");
    await db.query("DROP TABLE IF EXISTS topics;");
    await db.query("DROP TABLE IF EXISTS users;");
    await db.query(
      "CREATE TABLE topics(slug varchar PRIMARY KEY, description varchar, img_url varchar(1000));"
    );
    await db.query(
      "CREATE TABLE users(username varchar PRIMARY KEY, name varchar, avatar_url varchar(1000));"
    );
    await db.query(
      "CREATE TABLE articles(article_id serial PRIMARY KEY, title varchar, topic varchar REFERENCES topics(slug), author varchar REFERENCES users(username), body text, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, votes INT DEFAULT 0, article_img_url varchar(1000));"
    );
    await db.query(
      "CREATE TABLE comments(comment_id serial PRIMARY KEY, article_id INT REFERENCES articles(article_id), body text, votes INT DEFAULT 0, author varchar REFERENCES users(username), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"
    );
    const topicFormattedData = topicData.map((topic) => {
      return [topic.slug, topic.description, topic.img_url];
    });
    const insertTopicsQuery = format(
      "INSERT INTO topics(slug, description, img_url) VALUES %L",
      topicFormattedData
    );
    await db.query(insertTopicsQuery);

    const userFormattedData = userData.map((user) => {
      return [user.username, user.name, user.avatar_url];
    });
    const insertUsersQuery = format(
      "INSERT INTO users(username, name, avatar_url) VALUES %L",
      userFormattedData
    );
    await db.query(insertUsersQuery);

    const articleFormattedData = articleData.map((article) => {
      const updatedArticle = convertTimestampToDate(article);
      return [
        updatedArticle.title,
        updatedArticle.topic,
        updatedArticle.author,
        updatedArticle.body,
        updatedArticle.created_at,
        updatedArticle.votes,
        updatedArticle.article_img_url,
      ];
    });
    const insertArticlesQuery = format(
      "INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING article_id, title",
      articleFormattedData
    );
    const insertArticlesResponse = await db.query(insertArticlesQuery);

    const articlesLookup = createLookupObject(insertArticlesResponse.rows);

    const commentFormattedData = commentData.map((comment) => {
      const updatedcomment = convertTimestampToDate(comment);
      return [
        updatedcomment.body,
        articlesLookup[comment.article_title],
        updatedcomment.author,
        updatedcomment.votes,
        updatedcomment.created_at,
      ];
    });
    const insertCommentsQuery = format(
      "INSERT INTO comments(body, article_id, author, votes, created_at) VALUES %L",
      commentFormattedData
    );
    await db.query(insertCommentsQuery);
  } catch (error) {
    console.log(`Error while seeding: ${error}`);
  }
};

module.exports = seed;
