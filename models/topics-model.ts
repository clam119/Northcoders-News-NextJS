import db from "@db/connection";
import Topic from "@lib/topicsInterface";

export async function fetchAllTopics() {
    const queryData = await db.query('SELECT * FROM topics');
    const { rows: allTopicsData } = queryData;
    return allTopicsData;
}

export async function createNewTopic(slug: string, description: string) {
    const topicsQuery = await db.query('SELECT * FROM topics;')
    const existingTopics = await topicsQuery.rows.map((topic: Topic): string => topic.slug)

    if (existingTopics.includes(slug)) {
        return Promise.reject({ status: 409, msg: 'That topic already exists.'})
    }

    if (slug === undefined || description === undefined) {
        return Promise.reject({ status: 404, msg: 'Missing Required Fields' })
    }

    if (typeof slug !== 'string' || typeof description !== 'string') {
        return Promise.reject({ status: 400, msg: 'Invalid Fields Data' })
    }

    const createTopic = await db.query(`INSERT INTO topics(slug, description) VALUES ($1, $2) RETURNING *;`, [slug, description])
    const queryData = await createTopic;
    const { rows: [newTopicData] } = queryData;
    return newTopicData;
}