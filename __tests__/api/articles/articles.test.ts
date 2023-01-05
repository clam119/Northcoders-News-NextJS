import { createMocks } from "node-mocks-http";
import seed from "@db/seeds/seed"
import testData from "@db/data/test-data"
import db from "@db/connection"
import Article from "@lib/articlesInterface";
import handleArticles from "@pages/api/articles";
import handleArticlesByArticleID from "@pages/api/articles/[article_id]";
import { fetchArticleByArticleID, updateArticleByArticleID } from "@models/articles-model";

// Before test suite re-seed database and once finished end connection to PSQL database.
beforeAll(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/articles', () => {

    it('Should return a status code of 200 if a successful GET request is made.', async() => {
        //Create a Mock GET Request to the /api/articles endpoint
        const { req, res } = createMocks({
            method: 'GET'
        })
        //Invoke with handleArticles Handler Function
        await handleArticles(req, res);
        //Assign Status Code & Expect to be 200 for successful GET Request
        const responseStatusCode = res._getStatusCode();
        expect(responseStatusCode).toBe(200)
    })

    it('Should return an array of all of the articles if a successful GET request is made.', async() => {
        const { req, res } = createMocks({
            method: 'GET'
        })
        //Make call to /api/articles endpoint
        await handleArticles(req, res);

        //Retrieve the data from the API call
        const responseData = res._getData();
        //Expect the response data to be type of: Array
        expect(Array.isArray(responseData)).toBe(true);
        //Expect each article in the response data array to have all of the below properties
        responseData.forEach((article: Article) => {
            expect(article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                votes: expect.any(Number)
            })
        })
    })

    it('Should return a total of 10 articles for a successful GET request.', async() => {
        const { req, res } = createMocks({
            method: 'GET',
        })
        await handleArticles(req, res);
        const responseData = res._getData();
        const numberOfArticles = responseData.length;
        expect(numberOfArticles).toBe(10);
    })

    it('Should return all 12 articles in the database if given an upper limit of 50.', async() => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { limit: 50 }
        })
        await handleArticles(req, res);
        const responseData = res._getData();
        const numberOfArticles = responseData.length;
        expect(numberOfArticles).toBe(12);
    })

    it('Should return an array of articles with the topic of mitch.', async() => {
        //Create Mock GET Request to /api/articles with a filtered query of topics: coding
        const { req, res } = createMocks({
            method: 'GET',
            query: { topic: 'mitch' }
        })
        //Make API call & expect all of the articles have the topic of "Coding"
        await handleArticles(req, res);
        const responseData = res._getData();
        responseData.forEach((article: Article) => {
            expect(article).toMatchObject({
                topic: 'mitch',
                article_id: expect.any(Number),
                title: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                votes: expect.any(Number)
            })
        })
    })

    it('Should return a status code of 400 if the passed in an invalid sort_by value.', async() => {
        // Create Mock GET Request with an invalid sort_by value of "non_existent_sort_by_value"
        const { req, res } = createMocks({
            method: 'GET',
            query: { sort_by: 'non_existent_sort_by_value'}
        })
        try {
            await handleArticles(req, res);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(400);
            expect(msg).toBe("Invalid Data Type")
        }
    })

    it('Should return a status code of 400 if the passed in an invalid order value.', async() => {
        // Create Mock GET Request with an invalid order value of "non_existent_order_value"
        const { req, res } = createMocks({
            method: 'GET',
            query: { sort_by: 'non_existent_order_value'}
        })
        try {
            await handleArticles(req, res);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(400);
            expect(msg).toBe("Invalid Data Type")
        }
    })

    it('Should return a default status code of 500 if an unsupported HTTP request is made.', async() => {
        const { req, res } = createMocks({
            method: 'DELETE',
        })
        try {
            await handleArticles(req, res);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(500);
            expect(msg).toBe("Bad Request")
        }
    })

})

describe('POST /api/articles', () => {

    it('Should return a status code of 201 if a successful POST request is made.', async() => {
        //Create a Mock POST Request to the /api/articles endpoint
        const postRequest = { author: 'butter_bridge', topic: 'cats', title: 'How to Tackle Cat Allergies', body: 'Today I will talk about how to tackle Cat Allergies!' }
        const { req, res } = createMocks({
            method: 'POST',
            body: postRequest
        })
        //Call the handleArticles Handler Function to trigger the API Request
        await handleArticles(req, res);
        const responseStatusCode = res._getStatusCode();
        expect(responseStatusCode).toBe(201)
    })

    it('Should return the posted comment with the additional properties of: article_id, created_at, votes and comment_count.', async() => {
        //Create a Mock POST Request to the /api/articles endpoint
        const postRequest = { author: 'butter_bridge', topic: 'mitch', title: 'Mitchs Rare Treasures', body: 'Oh boy Mitch, you and your hidden rare treasures...' }
        const { req, res } = createMocks({
            method: 'POST',
            body: postRequest
        })
        //Call the handleArticles Handler Function to trigger the API Request
        await handleArticles(req, res);
        const responseData = res._getData()[0]
        const numberOfProperties = Object.keys(responseData).length;
        //Expect the responseData to have 8 properties & the properties of: article_id, created_at, votes & comment_count
        expect(numberOfProperties).toBe(8);
        
        //Expect the responseData to include all of the required properties below:
        expect(responseData).toMatchObject({
            ...postRequest,
            article_id: expect.any(Number),
            created_at: expect.any(Date),
            votes: expect.any(Number),
            comment_count: expect.any(Number)
        }) 
    })
    
    it('Should return a status code of 404 & username not found - if the username in the body does not exist.', async() => {
        const invalidPostRequest = { author: 'butter_bridges', topic: 'mitch', title: 'Mitchs Rare Treasures', body: 'Oh boy Mitch, you and your hidden rare treasures...' }
        const { req, res } = createMocks({
            method: 'POST',
            body: invalidPostRequest
        })
        try {
            await handleArticles(req, res);
        }
        catch(err: any) {
            const { msg, status } = err;
            expect(msg).toBe('Username Not Found')
            expect(status).toBe(404)
        }       
    })

    it('Should return a status code of 404 & topic not found - if the topic in the body does not exist.', async() => {
        const invalidPostRequest = { author: 'butter_bridge', topic: 'mitchs', title: 'Mitchs Rare Treasures', body: 'Oh boy Mitch, you and your hidden rare treasures...' }
        const { req, res } = createMocks({
            method: 'POST',
            body: invalidPostRequest
        })
        try {
            await handleArticles(req, res);
        }
        catch(err: any) {
            const { msg, status } = err;
            expect(msg).toBe('Topic Not Found')
            expect(status).toBe(404)
        }       
    })

    it('Should return a status code of 400 if any of the parameters required in the body is not found.', async() => {
        const invalidPostRequest = {}
        const { req, res } = createMocks({
            method: 'POST',
            body: invalidPostRequest
        })
        try {
            await handleArticles(req, res);
        }
        catch(err: any) {
            const { msg, status } = err;
            expect(msg).toBe('Missing Required Fields')
            expect(status).toBe(400);
        }
    })

})

describe('GET /api/articles/[article_id]', () => {

    it('Should return a status code of 200 if a successful GET request is made.', async() => {
        //Create a Mock Request to the /api/articles/[article_id] endpoint for article 1
        const { req, res } = createMocks({
            method: 'GET',
            query: { article_id: 1 }
        })
        //Invoke the handleArticlesByArticleID Handler Function to manage the HTTP Request
        await handleArticlesByArticleID(req, res);
        
        //Check the status code and expect 200
        const responseStatusCode = res._getStatusCode();
        expect(responseStatusCode).toBe(200);
    })

    it('Should return the queried article with the article_id of 1.', async() => {
        //Invoke the fetchArticleByArticleID Model Function - This is because the
        //Data retrieved by the handler does not include the entire object & only body
        const responseData = await fetchArticleByArticleID(1);
        expect(responseData).toMatchObject({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            votes: 100
          })
    })

    it('Should return a status code of 404 if the queried article does not exist.', async() => {
        //Create a Mock Request to the /api/articles/[article_id] endpoint w/ non-existent article_id
        const { req, res } = createMocks({
            method: 'GET',
            query: { article_id: 9999999 }
        })
        //Pass the non-existent article_id mock call to the below handler in a try/catch block
        try {
            await handleArticlesByArticleID(req, res);
        }
        catch(err: any) {
            const { msg, status } = err;
            expect(status).toBe(404);
            expect(msg).toBe('Article with that ID not found.')
        }
    })

})

describe('PATCH /api/articles/[article_id]', () => {

    it('Should return a status code of 200 if a successful PATCH request is made.', async() => {
        // Create Mock Request to /api/articles/[article_id]
        // Create the Request Body being sent to PATCH request
        const patchRequestBody = { inc_votes: 1 }
        const { req, res } = createMocks({
            method: 'PATCH',
            query: { article_id: 2 },
            body: patchRequestBody
        })
        // Wait for the handleArticlesByArticleID Function to resolve & check status code
        await handleArticlesByArticleID(req, res);
        const responseStatusCode = res._getStatusCode();
        expect(responseStatusCode).toBe(200);
    })

    it('Should return with the updated article with the votes increased by 50', async() => {
        const patchRequest = await updateArticleByArticleID(1, 50)
        expect(patchRequest).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            votes: 150,
        })
    })

    it('Should return with the updated article with the votes decreased by 50', async() => {
        const patchRequest = await updateArticleByArticleID(3, -50)
        expect(patchRequest).toMatchObject({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            votes: -50,
        })
    })

    it('Should return a status code of 400 if any of the fields are an invalid data type', async() => {
        const patchRequestBody = { inc_votes: "I'm an invalid data type!" };
        const { req, res } = createMocks({
            method: 'PATCH',
            query: { article_id: 1 },
            body: patchRequestBody
        })
        try {
            await handleArticlesByArticleID(req, res);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(400);
            expect(msg).toBe('Invalid Fields Data')
        }
    })
    
    it('Should return a status code of 404 if a given Article_ID is invalid.', async() => {
        try {
            await updateArticleByArticleID(20000, 10)
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(404);
            expect(msg).toBe("Article with that ID not found")
        }
    })

})