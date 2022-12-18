import { createMocks } from 'node-mocks-http';
import seed from "@db/seeds/seed"
import testData from "@db/data/test-data"
import db from "@db/connection"
import Topic from "@lib/topicsInterface"
import handleTopics from "@pages/api/topics/index"

beforeAll(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/topics', () => {

    it('Should return a status code of 200 if a successful GET request is made.', async() => {
        // Create Mock Req & Res to /api/topics
        const { req, res } = createMocks({
            method: 'GET'
        })
        // Wait for the handleTopics Function to resolve & check status code
        await handleTopics(req, res);
        const responseStatusCode =  res._getStatusCode();
        expect(responseStatusCode).toBe(200);
    })

    it('Should return an array of topics that each have a slug & description', async() => {
        const { req, res } = createMocks({
            method: 'GET'
        })
        await handleTopics(req, res);
        const responseData = res._getData();
        expect(Array.isArray(responseData)).toBe(true);
        responseData.forEach((topic: Topic) => {
            expect(topic).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String)
            })
        }) 
    })

    it('Should return a default status code of 500 if an unavailable HTTP request is made.', async() => {
        const { req, res } = createMocks({
            method: 'PATCH'
        })
        await handleTopics(req, res);
        const responseStatusCode = res._getStatusCode();
        expect(responseStatusCode).toBe(500);
    })
    
})

describe('POST /api/topics', () => {

    it('Should return a status code of 201 if a successful POST request is made.', async() => {
        const newTopic: Topic = { slug: 'Japan', description: 'Articles about all things Japan!' }
        const { req, res } = createMocks({
            method: 'POST',
            body: newTopic
        })
        await handleTopics(req, res);
        const responseStatusCode = res._getStatusCode();
        expect(responseStatusCode).toBe(201)
    })

    it('Should return the posted topic back to the user upon a successful POST request.', async() => {
        const newTopic: Topic = { slug: 'Gaming', description: 'Do you enjoy games? Make sure to check these articles out!' }
        const { req, res } = createMocks({
            method: 'POST',
            body: newTopic
        })
        await handleTopics(req, res);
        const responseData = res._getData();
        expect(responseData).toEqual(newTopic) 
    })

    it('Should return a status code of 400 if any of the fields are an invalid data type.', async() => {
        const newTopic = { slug: 1, description: 'My slug is invalid and so this request is also invalid.'}
        const { req, res } = createMocks({
            method: 'POST',
            body: newTopic
        })
        try {
            await handleTopics(req, res);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(400);
            expect(msg).toBe('Invalid Fields Data')
        }
    })

    it('Should return a status code of 404 if any of the fields are missing.', async() => {
        const { req, res } = createMocks({
            method: 'POST',
            query: {}
        })
        try {
            await handleTopics(req, res);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(404);
            expect(msg).toBe('Missing Required Fields')
        }
    })

    it('Should return a status code of 409 if the user tries to create a topic that already exists.', async() => {
        const existingTopic = { slug: 'coding', description: 'Code is love, code is life' }
        const { req, res } = createMocks({
            method: 'POST',
            body: existingTopic
        })
        try {
            await handleTopics(req, res);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(409);
            expect(msg).toBe('That topic already exists.')
        }
    })
})