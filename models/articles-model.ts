import db from "@db/connection";
import Article from "@lib/articlesInterface";
import Topic from "@lib/topicsInterface";
import { User } from "@lib/utilsInterface";

export async function fetchAllArticles (topic: string, sort_by: string = "created_at", order: string = "DESC", limit: number = 10, p: number = 1)  {
    // Define a baseQuery that will be used to make queries to the Postgres DB
    let baseQuery = `SELECT articles.*, COUNT(comments.author) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

    // Define valid columns to query, queryValues and valid orders to query
    const queryValues: string[] = [];
    const validColumns: string[] = [
        "author",
        "title",
        "article_id",
        "topic",
        "created_at",
        "votes",
        "comments_count"
    ];
    const validOrders: string[] = [
        "ASC",
        "DESC",
        "asc",
        "desc"
    ]

    // Conditional Check 1 - If the user passes in a topic then this will be queried to the database
    if(topic) {
        baseQuery += ` WHERE articles.topic = $1`; // Add to the baseQuery the topic that's being queried
        queryValues.push(topic) //Push the topic to the queryValue, used to prevent SQL injection
        
        //Check the DB and return an error if there are no articles for given topic
        const dbTopicQuery = await db.query(`SELECT * FROM topics WHERE slug = $1;`, queryValues)
        const numberOfArticlesInTopic = dbTopicQuery.rows.length;
        if(numberOfArticlesInTopic === 0) {
            return Promise.reject({ status: 404, msg: 'Articles with that topic not found.'})
        }
    }

    // Conditional Check 2 - If the user passes in an invalid sort_by or order query, return Status 400 & invalid data type
    if(!validColumns.includes(sort_by) || !validOrders.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid Data Type" })
    }
    
    // After passing through all the above conditional checks - order by the sort_by and limit the amount of articles by the query provided
    baseQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order.toUpperCase()} LIMIT ${limit}`;

    const queryData = await db.query(baseQuery, queryValues)
    const { rows: allArticlesData } = queryData;
    return allArticlesData;

}

export async function createArticle(author: string, title: string, body: string, topic: string): Promise<Article | Error> {
    //Initial DB Queries for Valid Usernames & Topics - Returns Array Of Usernames
    const { rows: currentUsers } = await db.query('SELECT * FROM users;');
    const { rows: currentTopics } = await db.query('SELECT * FROM topics');

    //Get Valid Usernames & Topics By Mapping Respectively: Username & Slug
    const validUsernames = currentUsers.map((user: User) => user.username);
    const validTopics = currentTopics.map((topic: Topic) => topic.slug);
   
    //Conditional Check 1 - If any of the fields are missing then return a 
    if(!author || !title || !body || !topic) {
        return Promise.reject({ status: 400, msg: 'Missing Required Fields'})
    }

    //Conditional Check 2 - If the passed in "Author" aka "Username" does not exist, then throw a 404 username not found
    if(!validUsernames.includes(author)) {
        return Promise.reject({ status: 404, msg: 'Username Not Found' });
    }

    // Conditional Check 3 - If the passed in "Topic" does not exist, then throw a 404 topic not found 
    if(!validTopics.includes(topic)) {
        return Promise.reject({ status: 404, msg: 'Topic Not Found' });
    }

    //Post Operation to Postgres DB - First this will return the original posted article without comment_count
    const queryData = await db.query(`INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *;`, [author, title, body, topic]);
    const { rows: newArticleData } = queryData;
    
    //In order to append comment_count to the returned article data, a separate PSQL query that left joins is needed
    const newArticleID = await newArticleData[0].article_id;
    const { rows: newArticleWithCommentCount } =  await db.query(`SELECT articles.*, COUNT(comments.author) ::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [newArticleID]);
    return newArticleWithCommentCount;
}

export async function fetchArticleByArticleID (article_id: number) {
    //Initial DB query for the queried article
    const fetchArticle = await db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]);
    const { rows: [singleArticleData] } = fetchArticle;
    return singleArticleData;
}

export async function updateArticleByArticleID (article_id:number , inc_votes: number) {

}

export async function removeArticleByArticleID (article_id: number) {
    
}