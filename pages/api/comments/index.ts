import { NextApiRequest, NextApiResponse } from "next";
import { getAllComments } from "@controllers/comments-controller";

export default async function handleComments(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'GET':
            return getAllComments(req, res);
        default:
            res.status(500).json({ msg: 'Bad Request.' })
    }
}