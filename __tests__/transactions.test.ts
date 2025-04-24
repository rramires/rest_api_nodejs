import supertest from 'supertest';
import { app } from '../src/app';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import { title } from 'process';

describe('Transactions routes', () => {
    // Setup the server before running tests
    beforeAll(async () => {
        await app.ready();
    })

    // Teardown the server after running tests
    afterAll(async () => {
        await app.close();
    })

    // Tests

    it('should be able to create a new transaction', async () => {

        await supertest(app.server)
            .post('/transactions')
            .send({
                title: 'Test Transaction',
                amount: 1000,
                type: 'credit'
            })
            .expect(201)
    })
})

