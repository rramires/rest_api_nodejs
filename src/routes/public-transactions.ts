import { FastifyInstance } from "fastify"
import { knexConn } from '../database.js'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkSessionId } from "../middlewares/check-session-id.js"

export async function publicTransactionsRoutes(app: FastifyInstance) {

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
}