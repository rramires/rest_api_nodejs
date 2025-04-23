import { app } from './app.js'
import { env } from './validators/env.js'

// Start the server
app.listen({ port: env.HTTP_PORT }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Server is running at ${address} `)
})
