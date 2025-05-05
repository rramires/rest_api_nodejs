import { FastifyInstance } from "fastify"
import { knexConn } from './../database.js'

export async function helloRoute(app: FastifyInstance) {
    // Routes
    app.get('/', async () => {
        return 'Hello from Fastify!'
    })
    app.get('/db', async () => {
        // select for testing 
        const result = await knexConn.raw('SELECT 1 + 9 AS result;')
        //console.log(result[0].result)
        return `Database OK! Result from select is: ${JSON.stringify(result)}`
    })
}