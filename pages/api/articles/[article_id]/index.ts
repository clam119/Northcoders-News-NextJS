import { NextApiRequest, NextApiResponse } from "next";
import { 
    getArticleByArticleID,
    patchArticleByArticleID,
    deleteArticleByArticleID,
 } from "@controllers/articles-controller";

export default async function handleArticlesByArticleID(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'GET':
            return getArticleByArticleID(req, res);
        case 'PATCH':
            return patchArticleByArticleID(req, res);
        case 'DELETE':
            return deleteArticleByArticleID(req, res);
        default:
            res.status(500).json({ msg: 'Bad Request.' })
    }
}