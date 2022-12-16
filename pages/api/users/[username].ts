import { NextApiRequest, NextApiResponse } from "next";
import { getSingleUser } from "../../../controllers/users-controller";

export default async function handleSingleUser(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'GET':
            return getSingleUser(req, res);
        default: 
            res.status(500).json('Bad Request');
    }
}