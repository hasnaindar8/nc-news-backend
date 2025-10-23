const db = require("../connection");
const { format } = require("node-pg-format");
const {
  convertTimestampToDate,
  createLookupObject,
} = require("../seeds/utils.js");

const seed = async ({
  topicData,
  userData,
  articleData,
  commentData,
  emojiData,
  emojiArticleUserData,
  userTopicData,
  userArticleVotesData,
}) => {
  try {
    await db.query("DROP TABLE IF EXISTS user_article_votes;");
    await db.query("DROP TABLE IF EXISTS user_topic");
    await db.query("DROP TABLE IF EXISTS emoji_article_user");
    await db.query("DROP TABLE IF EXISTS emojis");
    await db.query("DROP TABLE IF EXISTS comments;");
    await db.query("DROP TABLE IF EXISTS articles;");
    await db.query("DROP TABLE IF EXISTS topics;");
    await db.query("DROP TABLE IF EXISTS users;");
    await db.query(
      `CREATE TABLE topics(
      slug varchar PRIMARY KEY, 
      description varchar, 
      img_url varchar(1000));`
    );
    await db.query(
      `CREATE TABLE users(
      username varchar PRIMARY KEY,
      name varchar,
      avatar_url varchar(1000));`
    );
    await db.query(
      `CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      topic VARCHAR NOT NULL REFERENCES topics(slug) ON DELETE CASCADE,
      author VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0 NOT NULL,
      article_img_url VARCHAR(1000)
    );`
    );
    await db.query(
      `CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY, 
      article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE, 
      body TEXT NOT NULL, 
      votes INT DEFAULT 0, 
      author VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
    );
    await db.query(
      `CREATE TABLE emojis (
      emoji_id SERIAL PRIMARY KEY,
      emoji VARCHAR NOT NULL
    );`
    );
    await db.query(
      `CREATE TABLE emoji_article_user (
      emoji_id INT NOT NULL REFERENCES emojis(emoji_id) ON DELETE CASCADE,
      username VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
      PRIMARY KEY (emoji_id, username, article_id)
    );`
    );
    await db.query(
      `CREATE TABLE user_topic (
      username VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      topic VARCHAR NOT NULL REFERENCES topics(slug) ON DELETE CASCADE,
      PRIMARY KEY (username, topic)
    );`
    );
    await db.query(
      `CREATE TABLE user_article_votes (
      username VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
      vote_count INT NOT NULL,
      PRIMARY KEY (username, article_id)
    );`
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

    const articlesLookup = createLookupObject(
      insertArticlesResponse.rows,
      "title",
      "article_id"
    );
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

    const emojiFormattedData = emojiData.map((obj) => {
      return [obj.emoji];
    });
    const insertEmojisQuery = format(
      `INSERT INTO emojis(
      emoji) VALUES %L RETURNING emoji_id, emoji`,
      emojiFormattedData
    );
    const insertEmojisResponse = await db.query(insertEmojisQuery);
    const emojisLookup = createLookupObject(
      insertEmojisResponse.rows,
      "emoji",
      "emoji_id"
    );
    const emojiArticleUserFormattedData = emojiArticleUserData.map((obj) => {
      return [
        emojisLookup[obj.emoji],
        obj.username,
        articlesLookup[obj.article_title],
      ];
    });
    const insertemojiArticleUserQuery = format(
      `INSERT INTO emoji_article_user(
      emoji_id, 
      username, 
      article_id) VALUES %L`,
      emojiArticleUserFormattedData
    );
    db.query(insertemojiArticleUserQuery);

    const userTopicFormattedData = userTopicData.map((obj) => {
      return [obj.username, obj.topic];
    });
    const insertUserTopicQuery = format(
      `INSERT INTO user_topic(
      username, 
      topic) VALUES %L`,
      userTopicFormattedData
    );
    db.query(insertUserTopicQuery);

    const userArticleVotesFormattedData = userArticleVotesData.map((obj) => {
      return [obj.username, articlesLookup[obj.article_title], obj.vote_count];
    });
    const insertUserArticleVotesQuery = format(
      `INSERT INTO user_article_votes(
      username, 
      article_id,
      vote_count) VALUES %L`,
      userArticleVotesFormattedData
    );
    db.query(insertUserArticleVotesQuery);
  
  } catch (error) {
    console.log(`Error while seeding: ${error}`);
  }
};

module.exports = seed;
