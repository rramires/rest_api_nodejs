import fastify from 'fastify'
import { knexConn } from './database.js'

const app = fastify()

app.get('/hello', async () => {
	return 'Hello from Fastify!'
})

app.get('/db', async () => {
	// select for testing 
	const result = await knexConn.raw('select 1+9 as result')
	//console.log(result[0].result)

	return `Result from database is: ${result[0].result}`
})

app.listen({ port: 3333 }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Server is running at ${address}`)
})
