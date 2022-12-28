import { createMocks } from "node-mocks-http";
import seed from "@db/seeds/seed"
import testData from "@db/data/test-data"
import db from "@db/connection"
import Comment from "@lib/commentsInterface"
import handleArticleComments from "@pages/api/articles/[article_id]/comments"

beforeAll(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/articles/[article_id]/comments', () => {

    it('Should return a status code of 200 if a successful GET request is made.', async() => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { article_id: 1}
        })
        await handleArticleComments(req, res);
        const responseStatusCode = res._getStatusCode();
        expect(responseStatusCode).toBe(200);
    })

    it('Should return an array of comments that each have their comment & article ids, author, body, votes and created dates.', async() => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { article_id: 3}
        })
        await handleArticleComments(req, res);
        const responseData = res._getData();
        responseData.forEach((comment: Comment) => {
            expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                author: expect.any(String),
                body: expect.any(String),
            })
        })
    })

    it('Should return a status code of 404 if given article does not exist.', async() => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { article_id: 9999999 }
        })
        try {
            await handleArticleComments(req, res);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(404);
            expect(msg).toBe('Article Not Found')
        }
    })

    it('Should return a default status code of 500 if an unavailable HTTP request is made.', async() => {
        const { req, res } = createMocks({
            method: 'PUT'
        })
        await handleArticleComments(req, res);
        const responseStatusCode = res._getStatusCode();
        const badRequestMessage = JSON.parse(res._getData());
        expect(responseStatusCode).toBe(500);
        expect(badRequestMessage).toEqual({ msg: 'Bad Request.' })
    })

}) 

describe('POST /api/articles/[article_id/comments', () => {
    
    it('Should return a status code of 201 if a succesful POST request is made.', async() => {
        const newComment: Comment = { username: 'butter_bridge',  body: 'A successful POST request!' }
        const { req, res } = createMocks({
            method: 'POST',
            query: { article_id: 1 },
            body: newComment
        }) 
        await handleArticleComments(req, res);
        const responseStatusCode = res._getStatusCode();
        expect(responseStatusCode).toBe(201);
    })

    it('Should return the posted comment back to the user upon a successful POST request.', async() => {
        const newComment: Comment = { username: 'butter_bridge', body: 'A successful POST request made in article 2!' }
        const { req, res } = createMocks({
            method: 'POST',
            query: { article_id: 2 },
            body: newComment
        })
        // Currently the .getData() function only returns the body but in a real POST request returns the entire object
        await handleArticleComments(req, res);
        const responseData = res._getData();
        expect(responseData).toBe('A successful POST request made in article 2!')
    })

    it('Should return a status code of 400 if any of the fields are an invalid data type', async() => {
        const newInvalidComment = { username: 123, body: 121 };
        const { req, res } = createMocks({
            method: 'POST',
            query: { article_id: 3 },
            body: newInvalidComment
        })
        try {
            await handleArticleComments(req, res);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(400);
            expect(msg).toBe("Invalid Fields Data")
        }
    })

    it('Should return a status code of 404 if any of the fields are missing', async() => {
        const newInvalidComment = {};
        const { req, res } = createMocks({
            method: 'POST',
            query: { article_id: 4 },
            body: newInvalidComment
        })
        try {
            await handleArticleComments(req, res);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(404);
            expect(msg).toBe("Missing Required Fields")
        }
    })

})