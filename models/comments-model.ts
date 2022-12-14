import db from "@db/connection";
import Comment from "@lib/commentsInterface";
import Article from "@lib/articlesInterface";

export async function fetchAllComments() {
    const queryData = await db.query(`SELECT * FROM comments`);
    const { rows: allCommentsData } = queryData;
    return allCommentsData
}

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
    
    // Checks to see if any of the parameters are undefined, if so return 404
    if (username === undefined || body === undefined) {
        return Promise.reject({ status: 404, msg: 'Missing Required Fields' })
    }

    // Checks the data type of parameters and rejects if not string
    if (typeof username !== 'string' || typeof body !== 'string') {
        return Promise.reject({ status: 400, msg: 'Invalid Fields Data' })
    }

    const createComment = await db.query(`INSERT INTO comments(author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [username, body, article_id]
    )

    const queryData = await createComment;
    const { rows: [newCommentData] } =  queryData;
    return newCommentData
}

export async function fetchCommentByCommentID (comment_id: number) {

    // Query the Postgres Database to check existing comments & how many comments exist
    const queryDbForComments = await db.query('SELECT * FROM comments;');
    const existingComments = [...queryDbForComments.rows];
    const numberOfExistingComments = existingComments.length;

    // If the comment_id exceeds the number of comments that exist, return 404 as that comment does not exist
    if (comment_id > numberOfExistingComments) {
        return Promise.reject({ status: 404, msg: 'Comment with that ID not found'})
    }
    
    const fetchComment = await db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id]);
    const { rows: [singleFetchedComment] } = fetchComment;
    return singleFetchedComment;
}

export async function updateCommentByCommentID (comment_id: number, inc_votes: number) {
    
    // Query the Postgres Database to check existing comments & how many comments exist
    const queryDbForComments = await db.query('SELECT * FROM comments;');
    const existingComments = [...queryDbForComments.rows];
    const numberOfExistingComments = existingComments.length;

    // If the comment_id exceeds the number of comments that exist, return 404 as that comment does not exist
    if (comment_id > numberOfExistingComments) {
        return Promise.reject({ status: 404, msg: 'Comment with that ID not found'})
    }

    // If inc_votes or comment_id are not of type number or don't exist, return 400
    if (typeof inc_votes !== 'number' || !inc_votes || !comment_id) {
        return Promise.reject({ status: 400, msg: 'Invalid Fields Data' });
    }

    const patchComment = await db.query(`UPDATE comments SET votes = (votes + $1) WHERE comment_id = $2 RETURNING *;`, [inc_votes, comment_id])
    const { rows: [singlePatchedComment] } = patchComment;
    return singlePatchedComment;
}

export async function removeCommentByCommentID (comment_id: number) {

    // Query the Postgres Database to check existing comments & how many comments exist
    const queryDbForComments = await db.query('SELECT * FROM comments;');
    const existingComments = [...queryDbForComments.rows];
    const numberOfExistingComments = existingComments.length;

    // If the comment_id exceeds the number of comments that exist, return 404 as that comment does not exist
    if (comment_id > numberOfExistingComments) {
        return Promise.reject({ status: 404, msg: 'Comment with that ID not found'})
    }
    
    await db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]);
    const successfulDelete = { status: 204, msg: `Successfully deleted comment with the ID of ${comment_id}`}
    return successfulDelete
}

