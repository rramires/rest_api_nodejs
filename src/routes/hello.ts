import { FastifyInstance } from "fastify"

export async function helloRoute(app: FastifyInstance) {
    // Routes
    app.get('/hello', async () => {
        return 'Hello from Fastify!'
    })
}