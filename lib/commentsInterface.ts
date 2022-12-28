export default interface Comment {
    comment_id?: string,
    votes?: number,
    created_at?: number
    author?: string,
    username?: string,
    article_id?: number,
    body: string,
}