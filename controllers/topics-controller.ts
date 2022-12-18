import { NextApiRequest, NextApiResponse } from "next";
import { fetchAllTopics, createNewTopic } from "@models/topics-model";
import Topic from "@lib/topicsInterface";

export async function getAllTopics(req: NextApiRequest, res: NextApiResponse) {
    const allTopicsData = await fetchAllTopics();
    try {
        res.status(200)
        .send(allTopicsData)
    }
    catch(err) {
        console.log(err, '< Error in /api/topics controller.')
    }
}

export async function postNewTopic(req: NextApiRequest, res: NextApiResponse) {
    const { slug, description }: Topic = req.body;
    const postedTopic = await createNewTopic(slug, description);
    try {
        res.status(201)
        .send(postedTopic)
    }
    catch(err) {
        console.log(err, '<< Error in topics controller.')
    }
}