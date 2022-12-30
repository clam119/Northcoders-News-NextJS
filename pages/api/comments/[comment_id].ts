import { NextApiRequest, NextApiResponse } from "next";
import { patchCommentByCommentID } from "@controllers/comments-controller";

export default async function handleSingleComment(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'PATCH':
            return patchCommentByCommentID(req, res);
        default: 
            res.status(500).json('Bad Request');
    }
}