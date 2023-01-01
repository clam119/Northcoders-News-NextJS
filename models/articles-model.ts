import db from "@db/connection";
import Article from "@lib/articlesInterface";

export async function fetchAllArticles (topic: string, sort_by: string = "created_at", order: string = "DESC", limit: number = 10, p: number = 1)  {

}

export async function createArticle() {

}

export async function fetchArticleByArticleID (article_id: number) {

}

export async function updateArticleByArticleID (article_id:number , inc_votes: number) {

}

export async function removeArticleByArticleID (article_id: number) {
    
}