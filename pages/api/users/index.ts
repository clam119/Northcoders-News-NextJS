import { NextApiRequest, NextApiResponse } from "next";
import { getAllUsers, postNewUser } from "@controllers/users-controller";

export default async function handleUsers(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'GET':
            return getAllUsers(req, res);
        case 'POST': 
            return postNewUser(req, res);
        default: 
            res.status(500).json({msg: 'Bad Request.'})
    }
}
