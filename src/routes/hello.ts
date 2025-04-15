import { FastifyInstance } from "fastify"
import { knexConn } from './../database.js'

export async function helloRoute(app: FastifyInstance) {
    // Routes
    app.get('/hello', async () => {
        return 'Hello from Fastify!'
    })
    app.get('/hellodb', async () => {
        // select for testing 
        const result = await knexConn.raw('select 1+9 as result')
        //console.log(result[0].result)
        return `Database OK! Result from select is: ${result[0].result}`
    })
}