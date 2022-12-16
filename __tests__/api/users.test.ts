import { createMocks } from 'node-mocks-http';
import seed from '../../db/seeds/seed';
import testData from '../../db/data/test-data';
import db from '../../db/connection';
import handleSingleUser from '../../pages/api/users/[username]';
import handleUsers from '../../pages/api/users/index';
import User from '../../lib/usersInterface';

beforeAll(() => seed(testData));
afterAll(() => db.end());

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

describe('GET /api/users/[username]', () => {

    it('Should return a status code of 200 if a successful GET request is made with a valid username.', async() => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { username: 'lurker'}
        })
        await handleSingleUser(req, res);
        const responseStatusCode = res._getStatusCode();
        expect(responseStatusCode).toBe(200);
    })

    it('Should return an user object if a successful GET request is made with a valid username.', async() => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { username: 'lurker'}
        })
        await handleSingleUser(req, res);
        const responseData = res._getData();
        expect(responseData).toEqual({
            username: 'lurker',
            name: 'do_nothing',
            avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
        })
    })

    it('Should return a status code of 400 if an invalid type is passed in the username field.', async() => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { username: 123456789 }
        })
        try {
            await handleSingleUser(req, res);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(400);
            expect(msg).toBe('Invalid Fields Data')
        }
    })
    
    it('Should return a status code of 404 if an invalid username is passed in.', async() => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { username: 'nonExistentUsername123'}
        })
        try {
            await handleSingleUser(req, res);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(404)
            expect(msg).toBe('Username Not Found');
        }
    })

    it('Should return a default status code of 500 if an unsupported HTTP method is invoked.', async() => {
        const { req, res } = createMocks({
            method: 'PUT'
        })
        await handleSingleUser(req, res);
        const responseStatusCode = res._getStatusCode();
        expect(responseStatusCode).toBe(500);
    })

})

describe('POST /api/users', () => {
    it('Should return a status code of 201 if a successful POST request is made.', async() => {
        // Create Mock Req & Res to /api/users
        const newUser: User = { username: 'NAL1998', name: 'Nhat Anh Le', avatar_url: 'https://scontent.fman4-2.fna.fbcdn.net/v/t1.18169-9/12243282_405218356351547_3411609076197569911_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=174925&_nc_ohc=NCFTrzMEyREAX-7w8_f&tn=GUMDvshL0XzfMHPY&_nc_ht=scontent.fman4-2.fna&oh=00_AfBOLIKq5HOqVG7Lgxdmb3i3GnK5vNLIkXGyKAl3wBz9GA&oe=63C18241'}
        const { req, res } = createMocks({
            method: 'POST',
            body:  newUser
        })
        // Wait for the handleUsers Function to resolve with the designated POST request & check code
        await handleUsers(req, res);
        const responseStatusCode =  res._getStatusCode();
        expect(responseStatusCode).toBe(201);
    })

    it('Should return an object containing the new user that was successfully posted.', async() => {
        const newUser: User = { username: 'clam119', name: 'Christopher Lam', avatar_url: 'https://i.ibb.co/M2nHQSC/me-and-best-mates.jpg'}
        const { req, res } = createMocks({
            method: 'POST',
            body: newUser
        })
        await handleUsers(req, res);
        const responseData = res._getData();
        expect(responseData).toMatchObject({
            username: 'clam119',
            name: 'Christopher Lam',
            avatar_url: 'https://i.ibb.co/M2nHQSC/me-and-best-mates.jpg'
        })
    })

    it('Should return a status code of 400 if any of the parameters aren\'t strings.', async() => {
        const invalidUser = { username: 123, name: 'Invalid Username Haha', avatar_url: 'true' };
        const { req, res } = createMocks({
            method: 'POST',
            body: invalidUser
        })
        
        try {
            await handleUsers(req, res);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(400)
            expect(msg).toBe('Invalid Fields Data');
        }
    })

    it('Should return a status code of 400 with a custom message if username already exists.', async() => {
        const newUser: User = { username: 'clam119', name: 'Christopher Lam', avatar_url: 'https://i.ibb.co/M2nHQSC/me-and-best-mates.jpg'}
        const { req, res } = createMocks({
            method: 'POST',
            body: newUser
        })

        try {
            await handleUsers(req, res);
        }
        catch(err: any) {
            const { status, msg } = err;
            expect(status).toBe(400)
            expect(msg).toBe('Username Already Exists')
        }
    })
})

export {}