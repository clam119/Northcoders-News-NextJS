export default interface ConvertTimestampToDate {
    created_at: number,
    title: string,
    topic: string,
    author: string,
    body: string,
    votes: number
  }

export interface CreateRef {
    [key: string | number]: string | number
}

export interface Comments {
    body: string,
    title: string,
    author: string,
    topic: string,
    votes: number,
    created_at: number
    created_by: string,
    belongs_to: string
}

export interface IdLookup {
    [key: string]: string | number
}

export interface Article {
    [key: string]: string | number 
    article_id: string,
    title: string,
    topic: string,
    author: string,
    body: string,
    created_at: string,
    votes: number
}

export interface Element {
    [key: string]: string
}

export interface Comment {
    article_id: string,
    author: string,
    created_at: string,
    body: string,
    votes: number
    created_by: number,
    belongs_to: string,
}

export interface Topic {
    description: string,
    slug: string
}

export interface User {
    username: string,
    name: string,
    avatar_url: string
}