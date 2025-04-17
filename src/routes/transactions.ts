import { FastifyInstance } from "fastify"
import { knexConn } from './../database.js'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

export async function transactionsRoutes(app: FastifyInstance) {

    // Insert
    app.post('/', async (request, reply) => {

        // validation schema
        const bodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })
        const { title, amount, type } = bodySchema.parse(request.body)

        // insert
        await knexConn('transactions').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : (amount) * -1
        })
        // 201 Created
        return reply.status(201).send()
    })

    // Select All
    app.get('/', async () => {

        // select
        const transactions = await knexConn('transactions').select()

        // if not found
        if (!transactions) {
            return { status: 404, message: 'Transactions not found' }
        }
        // if found 200 OK
        return { transactions }
    })

    // Select SUM
    app.get('/summary', async () => {

        // select
        const summary = await knexConn('transactions').sum('amount', { as: 'balance' }).first()
        // 200 OK
        return summary || { balance: 0 }
    })

    // Select Unique 
    app.get('/:id', async (request) => {

        // validation schema
        const paramsSchema = z.object({
            id: z.string().uuid()
        })
        const { id } = paramsSchema.parse(request.params)

        // select
        const transaction = await knexConn('transactions').where('id', id).first()

        // if not found
        if (!transaction) {
            return { status: 404, message: 'Transaction not found' }
        }
        // if found 200 OK
        return transaction
    })
}