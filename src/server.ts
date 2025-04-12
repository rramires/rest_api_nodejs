import fastify from 'fastify'

const app = fastify()

app.get('/hello', async () => {
	return 'Hello from Fastify!'
})

app.listen({ port: 3333 }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Server is running at ${address}`)
})
