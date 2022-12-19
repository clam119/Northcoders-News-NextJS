export default interface Article {
    [key: string]: string | number 
    article_id: string,
    title: string,
    topic: string,
    author: string,
    body: string,
    created_at: string,
    votes: number
}