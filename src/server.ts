import { env } from './validators/env.js'
//
import fastify from 'fastify'
import cookie from '@fastify/cookie'
//
import { helloRoute } from './routes/hello.js'
import { transactionsRoutes } from './routes/transactions.js'

// The application
const app = fastify()

// Plugins
app.register(cookie)

// Routes
app.register(helloRoute, {
	prefix: '/hello'
})
app.register(transactionsRoutes, {
	prefix: '/transactions'
})

// Start the server
app.listen({ port: env.HTTP_PORT }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Server is running at ${address} `)
})
