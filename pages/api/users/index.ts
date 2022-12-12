import { NextApiRequest, NextApiResponse } from "next";
import  db  from '../../../db/connection.js';

export default async function handleUsers(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method) {
        case 'GET':
            const queryData = await db.query('SELECT * FROM users;');
            const { rows: allUsersData } = queryData;
            res.status(200)
            .send(allUsersData)
            break;
        default: 
            res.status(500).json({msg: 'Bad Request.'})
    }
}
