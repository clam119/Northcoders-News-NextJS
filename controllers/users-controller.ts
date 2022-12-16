import { NextApiRequest, NextApiResponse } from "next";
import { fetchAllUsers, createNewUser, fetchSingleUser } from "../models/users-model";
import User from "../lib/usersInterface";

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
    const { username, name, avatar_url }: User = req.body;
    const postedUser = await createNewUser(username, name, avatar_url);
    try {
        res.status(201)
        .send(postedUser);
    }
    catch(err) {
        console.log(err, '<< Error in users controller.')
    }
}

export async function getSingleUser(req: NextApiRequest, res: NextApiResponse) {
    const { username } = req.query as { username: string }
    const singleUserData = await fetchSingleUser(username)
    try {
        res.status(200)
        .send(singleUserData);
    }
    catch(err) {
        console.log(err, '< /api/users/[username] controller error.')
    }
}