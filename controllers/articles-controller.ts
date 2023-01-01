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

}

export async function postNewArticle(req: NextApiRequest, res: NextApiResponse) {

}

export async function getArticleByArticleID(req: NextApiRequest, res: NextApiResponse) {

}

export async function patchArticleByArticleID(req: NextApiRequest, res: NextApiResponse) {

}

export async function deleteArticleByArticleID(req: NextApiRequest, res: NextApiResponse) {

}