import { env } from './validators/env.js';
//
import fastify from 'fastify'
import { knexConn } from './database.js'
import { randomUUID } from 'node:crypto'

const app = fastify()

app.get('/hello', async () => {
	return 'Hello from Fastify!'
})

app.get('/db', async () => {
	// insert 
	const transaction = await knexConn('transactions').insert({
		id: randomUUID(),
		title: 'Transaction 1',
		amount: 100,
	}).returning('*')
	console.log('Inserted:\n', transaction[0], '\n\n');

	// select
	const transactions = await knexConn('transactions').select('*')
		.where('amount', '=', 100)
	//console.log(transactions);.
	console.log('Select:\n', transactions);

	return transactions
})

app.listen({ port: env.HTTP_PORT }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Server is running at ${address} `)
})
