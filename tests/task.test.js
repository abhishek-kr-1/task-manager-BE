const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/taskModel');
const User = require('../src/models/userModel');

describe('Task Management API', () => {
    let user;
    let token;
    let taskId;

    beforeAll(async () => {
        user = await User.create({ username: 'testuser', password: 'password' });
        token = await request(app)
            .post('/auth/login')
            .send({ username: 'testuser', password: 'password' })
            .then(res => res.body.token);
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Task.deleteMany({});
    });

    describe('POST /tasks', () => {
        it('should create a new task', async () => {
            const res = await request(app)
                .post('/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Test Task', description: 'Test Description', status: 'pending', priority: 'high' });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('task');
            taskId = res.body.task._id;
        });
    });

    describe('PUT /tasks/:id', () => {
        it('should update the task', async () => {
            const res = await request(app)
                .put(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Updated Task' });

            expect(res.statusCode).toEqual(200);
            expect(res.body.task.title).toEqual('Updated Task');
        });
    });

    describe('POST /tasks/:id/assign', () => {
        it('should assign the task to another user', async () => {
            const newUser = await User.create({ username: 'anotheruser', password: 'password' });

            const res = await request(app)
                .post(`/tasks/${taskId}/assign`)
                .set('Authorization', `Bearer ${token}`)
                .send({ userId: newUser._id });

            expect(res.statusCode).toEqual(200);
            expect(res.body.task.assignedTo).toEqual(newUser._id.toString());
        });
    });

    describe('DELETE /tasks/:id', () => {
        it('should soft delete the task', async () => {
            const res = await request(app)
                .delete(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.task.deleted).toBeTruthy();
        });
    });

    describe('GET /tasks', () => {
        it('should return paginated tasks', async () => {
            const res = await request(app)
                .get('/tasks?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.tasks).toBeInstanceOf(Array);
        });
    });
});