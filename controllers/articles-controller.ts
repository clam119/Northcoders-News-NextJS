import { NextApiRequest, NextApiResponse } from "next";
import Article from "@lib/articlesInterface";
import {
    fetchAllArticles, 
    createArticle, 
    fetchArticleByArticleID, 
    updateArticleByArticleID, 
    removeArticleByArticleID,
}   from '@models/articles-model'

export async function getAllArticles(req: NextApiRequest, res: NextApiResponse) {
    const { topic, sort_by, order, limit, p } = req.query as { topic: string, sort_by: string, order: string, limit: any, p: any };
    const allArticlesData = await fetchAllArticles(topic, sort_by, order, limit, p);
    try {
        res.status(200)
        .send(allArticlesData)
    }
    catch(err) {
        console.log(err, '< /api/articles - getAllArticles Controller Function Error.')
    }
}

export async function postNewArticle(req: NextApiRequest, res: NextApiResponse) {
    const { author, title, body, topic  }: { author: string, title: string, topic: string, body: string } = req.body;
    const postedArticleData = await createArticle(author, title, body, topic);
    try {
        res.status(201)
        .send(postedArticleData)
    }
    catch(err) {
        console.log(err, '< /api/articles - postNewArticle Controller Function Error.')
    }
}

export async function getArticleByArticleID(req: NextApiRequest, res: NextApiResponse) {

}

export async function patchArticleByArticleID(req: NextApiRequest, res: NextApiResponse) {

}

export async function deleteArticleByArticleID(req: NextApiRequest, res: NextApiResponse) {

}