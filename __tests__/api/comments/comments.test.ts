import { createMocks } from "node-mocks-http";
import seed from "@db/seeds/seed"
import testData from "@db/data/test-data"
import db from "@db/connection"
import Comment from "@lib/commentsInterface"
import handleComments from "@pages/api/comments";
import handleSingleComment from "@pages/api/comments/[comment_id]";
import handleArticleComments from "@pages/api/articles/[article_id]/comments"
import { fetchCommentByCommentID, updateCommentByCommentID } from "@models/comments-model";

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

describe('GET /api/comments', () => {

    it('Should return a status code of 200 if a successful GET request is made.', async() => {
        // Create Mock Request to /api/comments
        const { req, res } = createMocks({
            method: 'GET'
        })
        // Wait for the handleComments Function to resolve & check status code
        await handleComments(req, res);
        const responseStatusCode = res._getStatusCode();
        expect(responseStatusCode).toBe(200);
    })

    it('Should return an array of comments that have the required fields of: body, votes, author, article_id', async() => {
        const { req, res } = createMocks({
            method: 'GET'
        })
        await handleComments(req, res);
        const responseData = res._getData();
        expect(Array.isArray(responseData)).toBe(true);
        responseData.forEach((comment: Comment) => {
            expect(comment).toMatchObject({
                body: expect.any(String),
                votes: expect.any(Number),
                author: expect.any(String),
                article_id: expect.any(Number),
            })
        })
    })

    it('Should return a default status code of 500 if an unavailable HTTP request is made.', async() => {
        const { req, res } = createMocks({
            method: 'POST'
        })
        await handleComments(req, res);
        const responseStatusCode = res._getStatusCode();
        expect(responseStatusCode).toBe(500);
    })

})

describe('GET /api/comments/[comment_id]', () => {

    it('Should return a status code of 200 if a successful GET request is made.', async() => {
        // Create a Mock Request to the /api/comments/[comment_id] endpoint
        const { req, res } = createMocks({
            method: 'GET',
            query: { comment_id: 1 }
        })
        // Call the handleSingleComments Handler Function to handle GET Request
        await handleSingleComment(req, res);
        const responseStatusCode = res._getStatusCode();
        expect(responseStatusCode).toBe(200);
    })

    it('Should return the comment passed with a valid comment_id of 1', async() => {
        // Similar to previous tests - although the HTTP Request provides the valid response
        // The test only provides the body upon res._getData()'s invocation
        const responseData = await fetchCommentByCommentID(1);
        expect(responseData).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
            author: "butter_bridge"
        })
    })

    it('Should return a status code of 404 if a given comment_id is invalid.', async() => {
        try {
            await fetchCommentByCommentID(20000);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(404);
            expect(msg).toBe("Comment with that ID not found")
        }
    })
})

describe('PATCH /api/comments/[comment_id]', () => {

    it('Should return a status code of 200 if a successful PATCH request is made.', async() => {
        // Create Mock Request to /api/comments/[comment_id]
        // Create the Request Body being sent to PATCH request
        const patchRequestBody = { inc_votes: 1 }
        const { req, res } = createMocks({
            method: 'PATCH',
            query: { comment_id: 2 },
            body: patchRequestBody
        })
        // Wait for the handleSingleComment Function to resolve & check status code
        await handleSingleComment(req, res);
        const responseStatusCode = res._getStatusCode();
        expect(responseStatusCode).toBe(200);
    })

    it('Should return with the updated comment with the votes increased by 50', async() => {
        /* As the createMocks Response Data only returns the body,
        following tests will use the model functions. However,
        the requests themselves do function normally.*/
        const patchRequest = await updateCommentByCommentID(1, 50)
        expect(patchRequest).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 66,
            author: 'butter_bridge',
            article_id: 9
        })
    })

    it('Should return with the updated comment with the votes decreased by 50', async() => {
        const patchRequest = await updateCommentByCommentID(1, -50)
        expect(patchRequest).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 16,
            author: 'butter_bridge',
            article_id: 9
        })
    })

    it('Should return a status code of 400 if any of the fields are an invalid data type', async() => {
        const patchRequestBody = { inc_votes: "I'm an invalid data type!" };
        const { req, res } = createMocks({
            method: 'PATCH',
            query: { comment_id: 1 },
            body: patchRequestBody
        })
        try {
            await handleSingleComment(req, res);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(400);
            expect(msg).toBe('Invalid Fields Data')
        }
    })
    
    it('Should return a status code of 404 if a given Comment_ID is invalid.', async() => {
        try {
            await updateCommentByCommentID(20000, 10)
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(404);
            expect(msg).toBe("Comment with that ID not found")
        }
    })

})
