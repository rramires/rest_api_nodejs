import { FastifyInstance } from "fastify"
import { knexConn } from './../database.js'
import { randomUUID } from 'node:crypto'

export async function transactionsRoutes(app: FastifyInstance) {
    // Routes
    app.get('/', async () => {
        // insert 
        const transaction = await knexConn('transactions').insert({
            id: randomUUID(),
            title: 'Transaction 1',
            amount: 100,
        }).returning('*')
        console.log('Inserted:\n', transaction[0], '\n\n');

        // select
        const transactions = await knexConn('transactions').select('*')
            .where('amount', '=', 100)
        //console.log(transactions);.
        console.log('Select:\n', transactions);

        return transactions
    })
}