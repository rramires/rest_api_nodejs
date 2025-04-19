import { FastifyInstance } from "fastify"
import { knexConn } from '../database.js'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkSessionId } from "../middlewares/check-session-id.js"

export async function privateTransactionsRoutes(app: FastifyInstance) {

    // Middleware to check if sessionId exists
    app.addHook('preHandler', checkSessionId)

    // Select All
    app.get('/', async (request) => {

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
    app.get('/summary', async (request) => {

        // get cookie
        const { sessionId } = request.cookies

        // select
        const summary = await knexConn('transactions')
            .where('session_id', sessionId)
            .sum('amount', { as: 'balance' }).first()
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

        // get cookie
        const { sessionId } = request.cookies

        // select
        const transaction = await knexConn('transactions')
            .where({
                'session_id': sessionId,
                'id': id
            }).first()

        // if not found
        if (!transaction) {
            return { status: 404, message: 'Transaction not found' }
        }
        // if found 200 OK
        return transaction
    })
}