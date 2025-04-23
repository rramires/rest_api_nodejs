import supertest from 'supertest';
import { app } from '../src/app';
import { beforeAll, afterAll, expect, test } from 'vitest';

// Setup the server before running tests
beforeAll(async () => {
    await app.ready();
})

// Teardown the server after running tests
afterAll(async () => {
    await app.close();
})

// tests
test('User must create a new transaction', async () => {

    await supertest(app.server)
        .post('/transactions')
        .send({
            title: 'Test Transaction',
            amount: 1000,
            type: 'credit'
        })
        .expect(201)
})