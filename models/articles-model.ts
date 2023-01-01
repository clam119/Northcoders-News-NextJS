import db from "@db/connection";
import Article from "@lib/articlesInterface";

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

export async function createArticle() {

}

export async function fetchArticleByArticleID (article_id: number) {

}

export async function updateArticleByArticleID (article_id:number , inc_votes: number) {

}

export async function removeArticleByArticleID (article_id: number) {
    
}