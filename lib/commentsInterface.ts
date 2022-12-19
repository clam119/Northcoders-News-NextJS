export default interface Comment {
    comment_id: string,
    body: string,
    article_id: number,
    author: string,
    votes: number,
    created_at: string
}