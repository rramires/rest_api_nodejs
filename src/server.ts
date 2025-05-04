import { app } from './app.js'
import { env } from './validators/env.js'

// Start the server
app.listen({
	port: env.HTTP_PORT,
	host: ("RENDER" in process.env) ? '0.0.0.0' : 'localhost'
}, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Server is running at ${address} `)
})
