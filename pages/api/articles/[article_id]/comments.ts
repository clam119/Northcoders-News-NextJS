import { NextApiRequest, NextApiResponse } from "next";
import { 
    getCommentsByArticleID, 
    postCommentByArticleID, 
    patchCommentByCommentID, 
    deleteCommentByCommentID
} from "@controllers/comments-controller"

export default async function handleArticleComments(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return getCommentsByArticleID(req, res)
        case 'POST':
            return postCommentByArticleID(req, res)
        case 'PATCH':
            return patchCommentByCommentID(req, res)
        case 'DELETE':
            return deleteCommentByCommentID(req, res)
        default: 
            res.status(500).json({msg: 'Bad Request.'})
    }
}