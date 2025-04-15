import { env } from './validators/env.js'
//
import fastify from 'fastify'
//
import { helloRoute } from './routes/hello.js'
import { transactionsRoutes } from './routes/transactions.js'

// The application
const app = fastify()

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
