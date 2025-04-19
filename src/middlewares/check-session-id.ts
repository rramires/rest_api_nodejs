import { FastifyReply, FastifyRequest } from "fastify"

export async function checkSessionId(request: FastifyRequest, reply: FastifyReply) {
    // check session id
    const sessionId = request.cookies.sessionId
    if (!sessionId) {
        // 401 Unauthorized
        return reply.status(401).send({ error: 'Unauthorized' })
    }
}