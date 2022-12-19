import db from "@db/connection";
import Comment from "@lib/commentsInterface";
import Article from "@lib/articlesInterface";

export async function fetchCommentsByArticleID (article_id: number, limit: number = 10, p: number = 1) {
    //If the passed in article ID exists - query and return the comments 
    let baseQuery = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC LIMIT $2`
    let queryValues = [article_id, limit]
    const existingArticles: Article[] = [];

    //If the page is greater than 1, will offset the returned comments retrieved from db
    if(p > 1) {
        baseQuery += `OFFSET ${limit}`
    }
    
    //Push existing articles into existingArticles to validate existence of article by given ID
    await db.query(`SELECT article_id FROM articles`).then(({ rows: articles }: { rows: Article[]}) =>
        articles.forEach((article) => existingArticles.push(article))
    );

    // If the articleID does not exist reject with status 404
    if(article_id > existingArticles.length) {
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
    }

    const response = await db.query(baseQuery, queryValues);
    const responseData = await response;
    const { rows: singleArticleComments } = responseData;

    return singleArticleComments;

}

export async function createCommentByArticleID (article_id: number, username: string, body: string) {

}

export async function updateCommentByCommentID (comment_id: number, inc_votes: number) {

}

export async function removeCommentByCommentID (comment_id: number) {

}

