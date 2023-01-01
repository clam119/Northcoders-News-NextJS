import { createMocks } from "node-mocks-http";
import seed from "@db/seeds/seed"
import testData from "@db/data/test-data"
import db from "@db/connection"
import Article from "@lib/articlesInterface";
import handleArticles from "@pages/api/articles";
import handleArticlesByArticleID from "@pages/api/articles/[article_id]";

// Before test suite re-seed database and once finished end connection to PSQL database.
beforeAll(() => seed(testData));
afterAll(() => db.end());
