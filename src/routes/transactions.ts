import { FastifyInstance } from "fastify"
import { knexConn } from './../database.js'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkSessionId } from "../middlewares/check-session-id.js"

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

        // get cookie if exists or add randon uuid
        let sessionId = request.cookies.sessionId ? request.cookies.sessionId : randomUUID()

        // set cookie   
        reply.setCookie('sessionId', sessionId, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        // insert
        await knexConn('transactions').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : (amount) * -1,
            session_id: sessionId
        })
        // 201 Created
        return reply.status(201).send()
    })

    // Select All
    app.get('/', {
        preHandler: [checkSessionId]
    }, async (request, reply) => {

        // get cookie
        const { sessionId } = request.cookies

        // select
        const transactions = await knexConn('transactions')
            .where('session_id', sessionId)
            .select()

        // if not found
        if (!transactions) {
            return { status: 404, message: 'Transactions not found' }
        }
        // if found 200 OK
        return { transactions }
    })

    // Select SUM
    app.get('/summary', {
        preHandler: [checkSessionId]
    }, async () => {

        // select
        const summary = await knexConn('transactions').sum('amount', { as: 'balance' }).first()
        // 200 OK
        return summary || { balance: 0 }
    })

    // Select Unique 
    app.get('/:id', {
        preHandler: [checkSessionId]
    }, async (request) => {

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