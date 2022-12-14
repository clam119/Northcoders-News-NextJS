import { NextApiRequest, NextApiResponse } from "next";
import { getCommentByCommentID, patchCommentByCommentID, deleteCommentByCommentID } from "@controllers/comments-controller";

export default async function handleSingleComment(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'GET':
            return getCommentByCommentID(req, res);
        case 'PATCH':
            return patchCommentByCommentID(req, res);
        case 'DELETE':
            return deleteCommentByCommentID(req, res);
        default: 
            res.status(500).json('Bad Request');
    }
}