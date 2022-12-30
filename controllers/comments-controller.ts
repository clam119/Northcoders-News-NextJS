import { NextApiRequest, NextApiResponse } from "next";
import Comment from "@lib/commentsInterface";
import { 
    fetchAllComments,
    fetchCommentsByArticleID, 
    createCommentByArticleID, 
    updateCommentByCommentID, 
    removeCommentByCommentID } from '@models/comments-model';

export async function getCommentsByArticleID(req: NextApiRequest, res: NextApiResponse) {
    const { article_id } = req.query as { article_id: any }
    const singleArticleData = await fetchCommentsByArticleID(article_id)
    try {
        res.status(200)
        .send(singleArticleData)
    }
    catch(err) {
        console.log(err, '< /api/articles/[article_id/comments controller error.')
    }
}

export async function postCommentByArticleID(req: NextApiRequest, res: NextApiResponse) {
    const { article_id } = req.query as { article_id: any };
    const { body, username } = req.body;
    const postedCommentData = await createCommentByArticleID(article_id, username, body )
    try {
        res.status(201)
        .send(postedCommentData)
    }
    catch(err) {
        console.log(err, 'An error has occurred in the postCommentByArticleID Comments Controller.')
    }
}

export async function getAllComments(req: NextApiRequest, res: NextApiResponse) {
    const allCommentsData = await fetchAllComments();
    try {
        res.status(200)
        .send(allCommentsData)
    }
    catch(err) {
        console.log(err, '< Error in /api/comments controller - getAllComments Function.')
    }
}

export async function patchCommentByCommentID(req: NextApiRequest, res: NextApiResponse) {
    const { comment_id } = req.query as { comment_id: any };
    const { inc_votes } = req.body;
    const singlePatchedComment = await updateCommentByCommentID(comment_id, inc_votes);
    try {
        res.status(200)
        .send(singlePatchedComment)
    }
    catch(err) {
        console.log(err, '< Error in /api/comments controller - patchCommentByCommentID Function.')
    }
}

export async function deleteCommentByCommentID(req: NextApiRequest, res: NextApiResponse) {

}