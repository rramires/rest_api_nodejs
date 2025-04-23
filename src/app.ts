import fastify from 'fastify'
import cookie from '@fastify/cookie'
//
import { helloRoute } from './routes/hello.js'
import { publicTransactionsRoutes } from './routes/public-transactions.js'
import { privateTransactionsRoutes } from './routes/private-transactions.js'

// The application
export const app = fastify()

// Global Hook
/* 
app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
}) 
*/

// Plugins
app.register(cookie)

// Public Routes ---------
app.register(helloRoute, {
    prefix: '/hello'
})

app.register(publicTransactionsRoutes, {
    prefix: '/transactions'
})

// Private Routes ---------
app.register(privateTransactionsRoutes, {
    prefix: '/transactions'
})