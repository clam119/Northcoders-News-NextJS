import { NextApiRequest, NextApiResponse } from "next";
import { getAllUsers } from "../../../controllers/users/getAllUsers";

export default async function handleUsers(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'GET':
            try {
                return  getAllUsers(req, res);
            }
            catch(err) {
                console.log(err)
            }
            break;
        default: 
            res.status(500).json({msg: 'Bad Request.'})
    }
}
