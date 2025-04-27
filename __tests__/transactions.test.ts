import supertest from 'supertest';
import { app } from '../src/app';
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest';
import { execSync } from 'node:child_process';

describe('Transactions routes', () => {
    // Setup the server before running tests
    beforeAll(async () => {
        await app.ready();
    })

    // Teardown the server after running tests
    afterAll(async () => {
        await app.close();
    })

    // Run before each test
    beforeEach(async () => {
        // delete all tables, if exists
        execSync('npm run knex -- migrate:rollback --all')
        // create tables
        execSync('npm run knex -- migrate:latest')
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

    it('should be able to list all transactions', async () => {

        const newTransaction = {
            title: 'Test Transaction',
            amount: 1000,
            type: 'credit'
        }

        // insert
        const createTransaction = await supertest(app.server)
            .post('/transactions')
            .send(newTransaction)

        // get cookies
        const cookies = createTransaction.get('Set-Cookie') || []

        // list
        const listAllTransactions = await supertest(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

        // test content
        expect(listAllTransactions.body.transactions).toEqual([
            expect.objectContaining({
                title: newTransaction.title,
                amount: newTransaction.amount
            })
        ])
    })
})

