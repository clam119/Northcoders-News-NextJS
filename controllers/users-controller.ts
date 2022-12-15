import { NextApiRequest, NextApiResponse } from "next";
import { fetchAllUsers, createNewUser } from "../models/users-model";

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

export async function postNewUser(req: NextApiRequest, res: NextApiResponse) {
    const { username, name, avatar_url } = req.body;
    const postedUser = await createNewUser(username, name, avatar_url);
    try {
        res.status(201)
        .send(postedUser);
    }
    catch(err: any) {
        console.log(err, '<< Error in users controller.')
    }
}
