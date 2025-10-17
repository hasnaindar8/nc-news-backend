const {
  getAllUsers,
  getAllArticlesByTopic,
  getAllCommentsByVotesLessThanZero,
  getAllTopics,
  getAllArticlesByUser,
  getAllCommentsByVotesMorethanTen,
} = require("./queries.js");
const db = require("./connection.js");

async function testQueries() {
  const getAllUsersResponse = await getAllUsers();
  // console.log(getAllUsersResponse.rows);

  const getAllArticlesByTopicResponse = await getAllArticlesByTopic("coding");
  // console.log(getAllArticlesByTopicResponse.rows);

  const getAllCommentsByVotesLessThanZeroResponse =
    await getAllCommentsByVotesLessThanZero();
  // console.log(getAllCommentsByVotesLessThanZero.rows);

  const getAllTopicsResponse = await getAllTopics();
  // console.log(getAllTopicsResponse.rows);

  const getAllArticlesByUserResponse = await getAllArticlesByUser("grumpy19");
  // console.log(getAllArticlesByUserResponse.rows);

  const getAllCommentsByVotesMorethanTenResponse =
    await getAllCommentsByVotesMorethanTen();
  console.log(getAllCommentsByVotesMorethanTenResponse.rows);

  await db.end();
}

testQueries();
