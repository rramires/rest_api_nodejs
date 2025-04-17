import { FastifyInstance } from "fastify"
import { knexConn } from './../database.js'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

export async function transactionsRoutes(app: FastifyInstance) {

    // Insert route
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
}