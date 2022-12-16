import { NextApiRequest, NextApiResponse } from "next";
import { getAllTopics, postNewTopic } from '../../../controllers/topics-controller';

export default async function handleTopics(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'GET':
            return getAllTopics(req, res);
        case 'POST': 
            return postNewTopic(req, res);
        default: 
            res.status(500).json({msg: 'Bad Request.'})
    }
}
