import { NextApiRequest, NextApiResponse } from "next";
import { getAllArticles, postNewArticle } from "@controllers/articles-controller";

export default async function handleArticles(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'GET':
            return getAllArticles(req, res);
        case 'POST':
            return postNewArticle(req, res);
        default:
            res.status(500).json({ msg: 'Bad Request.' })
    }
}