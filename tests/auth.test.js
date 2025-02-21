const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const jwt = require('jsonwebtoken');

describe('Authentication API', () => {
    beforeAll(async () => {
        await User.deleteMany({});
    });

    describe('POST /auth/signup', () => {
        it('should create a new user', async () => {
            const res = await request(app)
                .post('/auth/signup')
                .send({
                    username: 'testuser',
                    password: 'testpassword'
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
        });

        it('should return 400 for duplicate username', async () => {
            await request(app)
                .post('/auth/signup')
                .send({
                    username: 'testuser',
                    password: 'testpassword'
                });
            const res = await request(app)
                .post('/auth/signup')
                .send({
                    username: 'testuser',
                    password: 'newpassword'
                });
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /auth/login', () => {
        it('should login an existing user', async () => {
            await request(app)
                .post('/auth/signup')
                .send({
                    username: 'testuser',
                    password: 'testpassword'
                });
            const res = await request(app)
                .post('/auth/login')
                .send({
                    username: 'testuser',
                    password: 'testpassword'
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should return 401 for invalid credentials', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    username: 'testuser',
                    password: 'wrongpassword'
                });
            expect(res.statusCode).toEqual(401);
        });
    });

    describe('Token verification', () => {
        it('should verify a valid token', async () => {
            const user = await request(app)
                .post('/auth/signup')
                .send({
                    username: 'testuser',
                    password: 'testpassword'
                });
            const token = user.body.token;

            const res = await request(app)
                .get('/auth/verify')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
        });

        it('should return 401 for an invalid token', async () => {
            const res = await request(app)
                .get('/auth/verify')
                .set('Authorization', 'Bearer invalidtoken');
            expect(res.statusCode).toEqual(401);
        });
    });

    afterAll(async () => {
        await User.deleteMany({});
    });
});