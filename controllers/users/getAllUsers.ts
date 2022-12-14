import { NextApiRequest, NextApiResponse } from "next";
import { fetchAllUsers } from "../../models/users/fetchAllUsers";

export async function getAllUsers(req: NextApiRequest, res: NextApiResponse) {
    const allUsersData = await fetchAllUsers();
    try {
        res.status(200)
        .send(allUsersData);
    }
    catch(err) {
        console.log(err);
    }
}