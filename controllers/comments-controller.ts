import { NextApiRequest, NextApiResponse } from "next";
import Comment from "@lib/commentsInterface";
import { 
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

}

export async function patchCommentByCommentID(req: NextApiRequest, res: NextApiResponse) {

}

export async function deleteCommentByCommentID(req: NextApiRequest, res: NextApiResponse) {

}