import handleUsers from '../../../pages/api/users/index';
import db from '../../../db/connection';
import { createMocks } from 'node-mocks-http';
import User from '../../../ts-interfaces/usersInterface'

afterAll(() => db.end())

describe('GET /api/users', () => {

    it('Should return a status code of 200 if a successful GET request is made.', async() => {
        // Create Mock Req & Res to /api/users
        const { req, res } = createMocks({
            method: 'GET'
        })
        // Wait for the handleUsers Function to resolve with the designated GET request & check code
        await handleUsers(req, res);
        const responseStatusCode =  res._getStatusCode();
        expect(responseStatusCode).toBe(200);
    })

    it('Should return an array of objects with a length of 4 users.', async() => {
        const { req, res } = createMocks({
            method: 'GET'
        })
        await handleUsers(req, res);
        const responseData = res._getData();
        const responseDataLength = Object.keys(responseData).length;
        expect(Array.isArray(responseData)).toBe(true);
        expect(responseDataLength).toBe(4);
    })

    it('Should return an array of objects with the keys of username, name and avatar_url', async() => {
        const { req, res } = createMocks({
            method: 'GET'
        })
        await handleUsers(req, res);
        const responseData = res._getData();
        responseData.forEach((entry: User ) => {
            expect(entry).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String)
            })
        })
    })
    it('Should return a status code of 500 if an unavailable HTTP request is made.', async() => {
        const { req, res } = createMocks({
            method: 'PATCH',
        })
        await handleUsers(req, res);
        const responseStatusCode = res._getStatusCode();
        const badRequestMessage = JSON.parse(res._getData());
        expect(responseStatusCode).toBe(500);
        expect(badRequestMessage).toEqual({msg: 'Bad Request.'})
    })

})