import format from 'pg-format';
import db from "@db/connection"
import { User, Topic, Article, Comment } from "@lib/utilsInterface"
import { convertTimestampToDate, createRef, formatComments } from "@db/seeds/utils"

const seed = async ({ topicData, userData, articleData, commentData }: { topicData: any, userData: any, articleData: any, commentData: any;}) => {
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);

  const topicsTablePromise = db.query(`
  CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR
  );`);

  const usersTablePromise = db.query(`
  CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    avatar_url VARCHAR
  );`);

  await Promise.all([topicsTablePromise, usersTablePromise]);

  await db.query(`
  CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    topic VARCHAR NOT NULL REFERENCES topics(slug),
    author VARCHAR NOT NULL REFERENCES users(username),
    body VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    votes INT DEFAULT 0 NOT NULL
  );`);

  await db.query(`
  CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    body VARCHAR NOT NULL,
    article_id INT REFERENCES articles(article_id) NOT NULL,
    author VARCHAR REFERENCES users(username) NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`);

  const insertTopicsQueryStr = format(
    'INSERT INTO topics (slug, description) VALUES %L RETURNING *;',
    topicData.map(({ slug, description }: { slug: string, description: string}) => [slug, description])
  );
  const topicsPromise = db
    .query(insertTopicsQueryStr)
    .then((result: any) => result.rows);

  const insertUsersQueryStr = format(
    'INSERT INTO users ( username, name, avatar_url) VALUES %L RETURNING *;',
    userData.map(({ username, name, avatar_url }: { username: string, name: string, avatar_url: string}) => [
      username,
      name,
      avatar_url,
    ])
  );
  const usersPromise = db
    .query(insertUsersQueryStr)
    .then((result: any) => result.rows);

  await Promise.all([topicsPromise, usersPromise]);

  const formattedArticleData: any = articleData.map(convertTimestampToDate);
  const insertArticlesQueryStr = format(
    'INSERT INTO articles (title, topic, author, body, created_at, votes) VALUES %L RETURNING *;',
    formattedArticleData.map(
      ({ title, topic, author, body, created_at, votes = 0 }: { title: string, topic: string, body: string, author: string, created_at: string, votes: number}) => [
        title,
        topic,
        author,
        body,
        created_at,
        votes,
      ]
    )
  );

  const articleRows = await db
    .query(insertArticlesQueryStr)
    .then((result: any) => result.rows);

  const articleIdLookup = createRef(articleRows, 'title', 'article_id');
  const formattedCommentData = formatComments(commentData, articleIdLookup);

  const insertCommentsQueryStr = format(
    'INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L RETURNING *;',
    formattedCommentData.map(
      ({ body, author, article_id, votes = 0, created_at }) => [
        body,
        author,
        article_id,
        votes,
        created_at,
      ]
    )
  );
  return db.query(insertCommentsQueryStr).then((result: any) => result.rows);
};

export default seed;
