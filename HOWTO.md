### TypeScript

#### 1 - Init the project:

```sh
npm init -y
```

#### 2 - Change the configuration in package.json to use import instead of require

Add **type": "module"** at the beginning along with the project name, version etc

```json
"type": "module",
```

#### 3 - Install TypeScript and types, following this instructions:

[Install and Configure TypeScript](https://github.com/rramires/typescript_fundamentals?tab=readme-ov-file#typescript_fundamentals)

#### 4 - Add source and build/dist folder in tsconfig.json:

```json
"rootDir": "./src",
```
```json
"outDir": "./dist",
```

#### 5 - Modify package.json, in scripts section:

```json
"compile": "npx tsc",
```

#### 6 - Test compile App:

```sh
npm run compile
```

#### 7 - If the compiler picks up any unwanted files, just add the exclusion of that file, or folder, at the end of tsconfig.json

```js
...
"skipLibCheck": true 
} 
// After this, add:

//,"exclude": [
//  "excluded_folder",
//  "excluded_file.ts",
//  "**/__excluded_joker__ /*"
//]

// Befone the last brace:
}
```

---

### Fastify

#### 1 - Install Fastify

```sh
npm i fastify
```

#### 2 - Rename or create server.ts and add Fastify Hello:

```js
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
```

#### 3 - Modify package.json, in scripts section:

```json
"dev": "tsx watch src/server.ts",
```

#### 4 - Running the App:

```sh
npm run dev
```

#### 5 - Access via HTTPie or in your browser:

```sh
http GET localhost:3333/hello
```

---

### KnexJs

#### 1 - Install KnexJs

```sh
npm install knex
```

#### 2 - Install SQLite and Types

```sh
npm install better-sqlite3
npm install @types/better-sqlite3 -D
```

#### 3 - Create Knex-SQLite connection in database.ts file

```js
import knex, { Knex } from 'knex'

export const config: Knex.Config = {
    client: 'better-sqlite3',
    connection: {
        filename: './db/app.db'
    },
    useNullAsDefault: true,
    migrations: {
        directory: './db/migrations',
        extension: 'ts'
    }
}

export const knexConn: Knex = knex(config)
```

#### 4 - Create db folder in root and add to .gitignore

```sh
# App SQLite db
db/app.db
```

#### 5 - Add route for testing connection to db in server.ts

```js
import { knexConn } from './database.js'

app.get('/db', async () => {
	// select for testing 
	const result = await knexConn.raw('select 1+9 as result')
	//console.log(result[0].result)

	return `Result from database is: ${result[0].result}`
})
```

#### 6 - Access via HTTPie or in your browser:

```sh
http GET localhost:3333/db
```

#### 7 - Create knexfile.ts in root folder, for migrations:

```js
import { config } from "./src/database.js"

export default config
```

#### 8 - Adding knex command in package.json:
* The file created above file is originally javascript and not typescript  
Migrations in knex were not written to run with typescript  
Let's solve this by creating a command in the scripts section of package.json

```json
"knex": "node --import tsx ./node_modules/knex/bin/cli.js",
```
* Now every knex migration command must be preceded by: **npm run knex --**  
For example, let's call help
```sh
npm run knex -- -h
```

#### 9 - Creating the first migration (e.g. entity documents)

```sh
npm run knex -- migrate:make create-transactions 
```

#### 10 - If you get an error in VSCode PROBLEMS because these .ts are outside the rootDir.
* use the exclude at the end of tsconfig.json for now.

```json
"exclude": [
	"knexfile.ts",
	"db/migrations"
]
```

#### 11 - Adding table in migration

```js
// in up function
await knex.schema.createTable("transactions", (table) => {
        table.uuid("id").primary()
        table.text("title").notNullable()
        table.decimal("amount", 14, 2).notNullable()
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable()
    })
// in down function
await knex.schema.dropTableIfExists("transactions")
```

#### 12 - Execute migration

```sh
npm run knex -- migrate:latest 
```

#### 13 - Install SQLite Viewer extension  

[SQLite Viewer](https://marketplace.visualstudio.com/items?itemName=qwtel.sqlite-viewer)

* After installing, click on app.db and see the table **transactions** created by migration and the auxiliary tables

#### 14 - Rollback migration

```sh
npm run knex -- migrate:rollback
``` 

* Go back to SQL Viewer, reload and see that the transactions table has been deleted.

#### 15 - Add a new migration to create a new field

```sh
npm run knex -- migrate:make add-session-id-to-transactions
```

Migration content:

```js
// in up function
await knex.schema.alterTable("transactions", (table) => {
	table.uuid("session_id").after("id").nullable()
})
// in down function
await knex.schema.alterTable("transactions", (table) => {
	table.dropColumn("session_id")
})
```
Execute again:

```sh
npm run knex -- migrate:latest 
```
#### 16 - View the creation in SQLite Viewer

* Note: It is not necessary to rollback to create the new field. In this case, rollback was done for testing(or learning) purposes only.
* Note: The session_id field was created at the end and not after the id, despite being specified in the migration. This is because SQLite does not support it. Other databases such as MySQL, Postgress etc would probably support it.

#### 17 - Create simple Insert and Select for test, in servers.ts get /db

```js
app.get('/db', async () => {
	// insert 
	const transaction = await knexConn('transactions').insert({
		id: randomUUID(),
		title: 'Transaction 1',
		amount: 100,
	}).returning('*')
	console.log('Inserted:\n', transaction[0], '\n\n')

	// select
	const transactions = await knexConn('transactions').select('*')
		.where('amount', '=', 100)
	//console.log(transactions).
	console.log('Select:\n', transactions)

	return transactions
})
```

#### 18 - Access via HTTPie or in your browser:

```sh
http GET localhost:3333/db
```

---

### Environment variables

#### 1 - Install DotENV extension:

[DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)

#### 2 - Create .env file in the root folder, with these variables:

```ini
# SQLite database path
DATABASE_PATH="./db/app.db"
```

#### 3 - Create .env.example, which will be added to the versioning in git:

```ini
# SQLite database path, e.g. "./db/app.db"
DATABASE_PATH=
```

#### 4 - Install DotENV

```sh
npm i dotenv
```

#### 5 - Import/call DotENV at the beginning of the server.ts file  

* It is important that DotENV is loaded first of all, in the first app file, to be available to the other modules.  
* DotENV will inject all .env variables into process.env  

```js
import "dotenv/config"
// before this
import fastify from 'fastify'
```

#### 6 - Replace the path provided in database.ts with the one from the environment variable  

* It is possible to set a fixed default value using or ||  
I personally don't like it

```js
filename: String(process.env.DATABASE_PATH) // || './db/app.db' 
```

---

### Zod for validations

#### 1 - Install Zod

```sh
npm i zod
```

#### 2 - Add more environment variables 

.env

```ini
# Node/App Environment - e.g. "development", "test" or "production"
NODE_ENV="development"

# Application http port - e.g. 3333
HTTP_PORT=3333

# SQLite database path - e.g. "./db/app.db"
DATABASE_PATH='./db/app.db'
```

.env.example

```ini
# Node/App Environment - e.g. "development", "test" or "production"
NODE_ENV=

# Application http port - e.g. 3333
HTTP_PORT=

# SQLite database path - e.g. "./db/app.db"
DATABASE_PATH=
```

#### 3 - Create validators folder and env.ts file

```js
import "dotenv/config"
import { z } from 'zod'

// Rules for environment variables
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    HTTP_PORT: z.coerce.number().default(3333),
    DATABASE_PATH: z.string()
})

// Validate environment variables
const _env = envSchema.safeParse(process.env)
if (_env.success === false) {
    console.error('Invalid environment variables:', _env.error.format())
    throw new Error('Invalid environment variables')
}
// Export the validated environment variables
export const env = _env.data
```

#### 4 - Replace variables in database.ts 

```js
// add
import { env } from './validators/env.js'
// replace
filename: env.DATABASE_PATH
```

#### 5 - Replace 3333 port for variable in server.ts 

```js
// remove
import "dotenv/config"
// replace to
import { env } from './validators/env.js'
// and remove
3333
// replace to
port: env.HTTP_PORT
```

---

### Organizing the Routes

#### 1 - Create the routes folder and the hello.ts file

The skeleton of routes

```js
import { FastifyInstance } from "fastify"

export async function yourRoutes(app: FastifyInstance) {
    // Routes

}
```

#### 2 - Cut the "hello" route from server.ts and paste it here 

```js
import { FastifyInstance } from "fastify"

export async function helloRoute(app: FastifyInstance) {
    // Routes
    app.get('/hello', async () => {
        return 'Hello from Fastify!'
    })
}
```

#### 3 - Let's create another route to test the connection to the database

```js
// import 
import { knexConn } from './../database.js'
// add after hello route
app.get('/hellodb', async () => {
    // select for testing 
    const result = await knexConn.raw('select 1+9 as result')
    //console.log(result[0].result)
    return `Database OK! Result from select is: ${result[0].result}`
})
```

#### 4 - Add this route in server.ts

```js
// import
import { helloRoute } from './routes/hello.js'
// add after the app instance "const app = fastify()"
// Routes
app.register(helloRoute)
```

#### 5 - Running the App:

```sh
npm run dev
```

#### 6 - Access via HTTPie or in your browser:

```sh
http GET localhost:3333/hello
and
http GET localhost:3333/hellodb
```

#### 7 - Create in the routes folder transactions.ts file and add skeleton of route
 
```js
import { FastifyInstance } from "fastify"

export async function yourRoutes(app: FastifyInstance) {
    // Routes

}
```

#### 8 - Cut the "db" route from server.ts and paste it here

* Replace **db** route to **transactions** route

```js
import { FastifyInstance } from "fastify"
import { knexConn } from './../database.js'
import { randomUUID } from 'node:crypto'

export async function transactionsRoutes(app: FastifyInstance) {
    // Routes
    app.get('/transactions', async () => {
        // insert 
        const transaction = await knexConn('transactions').insert({
            id: randomUUID(),
            title: 'Transaction 1',
            amount: 100,
        }).returning('*')
        console.log('Inserted:\n', transaction[0], '\n\n')

        // select
        const transactions = await knexConn('transactions').select('*')
            .where('amount', '=', 100)
        //console.log(transactions).
        console.log('Select:\n', transactions)

        return transactions
    })
}
```

#### 9 - Add this route in server.ts

```js
// import
import { transactionsRoutes } from './routes/transactions.js'
// Routes
app.register(transactionsRoutes)
```

#### 10 - Running the App:

```sh
npm run dev
```

#### 11 - Access via HTTPie or in your browser:

```sh
http GET localhost:3333/transactions
```

---  

### Adding Prefix to Routes

* All entity routes start with the entity name. e.g.  
[POST] in /transactions = insert  
[GET] in /transactions = select  
[GET] in /transactions/:id = select with filter, etc  
So to make things easier, we will create the prefix as a parameter when registering the route.

#### 1 - Adding prefix in server.js

```js
app.register(helloRoute, {
	prefix: '/hello'
})
app.register(transactionsRoutes, {
	prefix: '/transactions'
})
```

#### 2 - Fixing the hello route, removing hello

```js
app.get('/', async () => {
    return 'Hello from Fastify!'
})
app.get('/db', async () => {
// ...
```

#### 2 - Fixing the transactions route, removing transactions

```js
app.get('/', async () => {
    // insert 
    ///const transaction ...
```

#### 3 - Running the App:

```sh
npm run dev
```

#### 4 - Access via HTTPie or in your browser:

```sh
http GET localhost:3333/hello
and
http GET localhost:3333/hello/db
and
http GET localhost:3333/transactions
```

---

### Creating a Real Route

#### 1 - Adding insert route in transaction.ts

* Remove the entire app.get route example first

```js
// import
import { z } from 'zod'

// in transactionsRoutes

// Insert
app.post('/', async (request, reply) => {

    // validation schema
    const bodySchema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(['credit', 'debit'])
    })
    const { title, amount, type } = bodySchema.parse(request.body)

    // insert
    await knexConn('transactions').insert({
        id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : (amount) * -1
    })
    // 201 Created
    return reply.status(201).send()
})
```

#### 2 - Delete app.db

```sh
rm db/app.db 
```

#### 3 - Run migrations again to recreate the database

```sh
npm run knex -- migrate:latest 
```

#### 4 - Create a new request collection in Insominia(Rest API Node)

#### 5 - Add Two POSTs methods

* Create Transaction Credit 1  
[POST] http://127.0.0.1:3333/transactions  

body:  

```json
{
	"title": "Freelancer Job",
	"amount": 8000,
	"type": "credit"
}
```

* Create Transaction Debit 1  
[POST] http://127.0.0.1:3333/transactions  

body: 

```json
{
	"title": "Buy Laptop",
	"amount": 3000,
	"type": "debit"
}
```

#### 6 - Running the App:

```sh
npm run dev
```

#### 6 - Send requests and see them in the database

--- 

### Adding Types in Knes

#### 1 - Create a new folder in src called **@types**  
* You'll see it at the top.

#### 2 - Create a new file called **knex.d.ts** and

* This will override a method from the Knex module, allowing complete code of table names and fields.

```js
// eslint-disable-next-line 
import { Knex } from 'knex'

declare module 'knex/types/tables.js' {
    interface Tables {
        // Tables 
        transactions: {
            id: string
            title: string
            amount: number
            created_at: string
            session_id?: string
        }
    }
}
```

#### 3 - After creating the table typing file, autocomplete works on methods, in table name, in table fields and generates error if field does not exist

* Try/test deleting the table name and fields and typing again.  
Then don't forget to undo the changes.  

```js
await knexConn('transactions').insert({ // complete 'transactions'
    id: randomUUID(), // complete id
    title, // complete title
    amount: type === 'credit' ? amount : (amount) * -1, // complete amount
    test: 1 // error because it was not defined in knex.d.ts
})
```

---

### Creating Listing Routes

#### 1 - Adding select All route

```js
// Select All
app.get('/', async () => {

    // select
    const transactions = await knexConn('transactions').select()

    // if not found
    if (!transactions) {
        return { status: 404, message: 'Transactions not found' }
    }
    // if found 200 OK
    return { transactions }
})
```

#### 2 - Adding select Unique route

```js
// Select Unique
app.get('/:id', async (request) => {

    // validation schema
    const paramsSchema = z.object({
        id: z.string().uuid()
    })
    const { id } = paramsSchema.parse(request.params)

    // select
    const transaction = await knexConn('transactions').where('id', id).first()

    // if not found
    if (!transaction) {
        return { status: 404, message: 'Transaction not found' }
    }
    // if found 200 OK
    return transaction
})
```

#### 4 - In Insominia, create two requests using [GET] in methods

List All Transactions  
[GET]  

```sh
http://127.0.0.1:3333/transactions
``` 

List Unique Transaction   
[GET]

```sh
http://127.0.0.1:3333/transactions/insert-transaction-id-here
``` 

* Try List Unique Transaction, with an invalid id: http://127.0.0.1:3333/transactions/123  
  It should return error 500, because of paramsSchema validating the uuid  

* Try to, using other valid uiid: **5fd50b52-5a8d-46b7-8b0a-91376bcd3f24**  
  Should return status 404 + Transaction not found  

#### 5 - Adding summary route

```js
// Select SUM
app.get('/summary', async () => {

    // select
    const summary = await knexConn('transactions').sum('amount', { as: 'balance' }).first()
    // 200 OK
    return summary || { balance: 0 }
})
```

#### 4 - In Insominia, create request using GET get method

List Summary   
[GET]

```sh
http://127.0.0.1:3333/transactions/summary
```

* Returns {"balance":5000}  

---

### Working with cookies in Fastify

#### 1 - Install Fastify cookies

```sh
npm i @fastify/cookie
```

#### 2 - Register cookie bundle, before routes

```javascript
// import
import cookie from '@fastify/cookie'

// const app = fastify()

// Plugins
app.register(cookie)

// Routes ...
```

#### 3 - Adding session cookie in transactions.ts 

```javascript
// after const { title, amount, type...

// get cookie if exists or add randon uuid
let sessionId = request.cookies.sessionId ? request.cookies.sessionId : randomUUID()

// set cookie   
reply.setCookie('sessionId', sessionId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
})

// Add sessionId in the insert object, after amount
session_id: sessionId
// 
```

#### 4 - Creating more two transactions in Insomnia

* [POST] http://127.0.0.1:3333/transactions  

Create Transaction Credit 2

body: 

```json
{
	"title": "Dividends Received",
	"amount": 4500,
	"type": "credit"
}
```
And create Transaction Debit 2  

body: 

```json
{
	"title": "Buy Cellphone",
	"amount": 500,
	"type": "debit"
}
```

#### 5 - Check using List All Transactions in Insomnia

* Note that the **session_id** field of the last two records inserted has the same session_id  
[GET] http://127.0.0.1:3333/transactions

```json
{
    "id": "a3cc59c0-ee2b-4f4a-96f7-249cd7cafae1",
    "title": "Dividends Received",
    "amount": 4500,
    "created_at": "2025-04-18 02:44:22",
    "session_id": "0d5f85d8-7899-4499-b572-fcd67a277357"
},
{
    "id": "ea6c4820-1f8c-43ce-b447-9f8da723cb72",
    "title": "Buy Cellphone",
    "amount": -500,
    "created_at": "2025-04-18 02:44:26",
    "session_id": "0d5f85d8-7899-4499-b572-fcd67a277357"
}
```

--- 

### Validating the existence of cookies

#### 1 - Add in transactions.ts in the Select All method

```javascript
// add
// check session id
const sessionId = request.cookies.sessionId
if (!sessionId) {
    // 401 Unauthorized
    return reply.status(401).send({ error: 'Unauthorized' })
}

// and filter select by sessionId
const transactions = await knexConn('transactions')
    .where('session_id', sessionId)
    .select()
```

#### 2 - Check using List All Transactions in Insomnia

* [GET] http://127.0.0.1:3333/transactions  
The result is:

```json
{ "error": "Unauthorized" }
```

#### 3 - But if you create a new transactions the id filter will only bring the new ones

* Create Transaction Credit 1  
Create Transaction Debid 1  
[POST] http://127.0.0.1:3333/transactions  

* [GET] http://127.0.0.1:3333/transactions  
The result is:

```json
{
	"transactions": [
		{
			"id": "6b4b058e-1fd2-4b8c-a6ad-99c0e936890f",
			"title": "Freelancer Job",
			"amount": 8000,
			"created_at": "2025-04-19 02:44:07",
			"session_id": "bfaad0ae-45a4-4b29-90bf-b8c9875c58eb"
		},
		{
			"id": "8decaeda-3224-42ea-903a-621394c78c36",
			"title": "Freelancer Job",
			"amount": -3000,
			"created_at": "2025-04-19 02:44:17",
			"session_id": "bfaad0ae-45a4-4b29-90bf-b8c9875c58eb"
		}
	]
}
```

--- 

### Adding middlewares

* OK, Its works but we would have to check if the session id exists in other routes, like Summary and Select SUM, so let's separate this part into a middleware.

#### 1 - Create a middlewares folder and check-session-id.ts file, with

```js
import { FastifyReply, FastifyRequest } from "fastify"

export async function checkSessionId(request, reply) {
    // check session id
}
```

#### 2 - Cut part of id check from transactions.ts Select all and paste here

```js
export async function checkSessionId(request, reply) {
    // check session id
    const sessionId = request.cookies.sessionId
    if (!sessionId) {
        // 401 Unauthorized
        return reply.status(401).send({ error: 'Unauthorized' })
    }
}
```

#### 3 - In transactions.ts add get cookie, to make it work again

```js
// get cookie
const { sessionId } = request.cookies
```

#### 4 - And add the middleware after route path using preHandler

```js
// import 
import { checkSessionId } from "../middlewares/check-session-id.js"

// Select All
app.get('/', {
    preHandler: [checkSessionId]
}, async (request) => { //...
```

#### 5 - Add the filter by session Id in the where of the other queries

In Select SUM add

```js
// get cookie
const { sessionId } = request.cookies

// select
const transactions = await knexConn('transactions')
    .where('session_id', sessionId)
    .select()
// ...
```

In Select Unique add 
```js
// get cookie
const { sessionId } = request.cookies

// select
const transaction = await knexConn('transactions')
    .where({
        'session_id': sessionId,
        'id': id
    }).first()
```

#### 6 - Test the three routes in Insomnia

* [GET] http://127.0.0.1:3333/transactions  
[GET] http://127.0.0.1:3333/transactions/transaction_id  
[GET] http://127.0.0.1:3333/transactions/summary  

Operations should occur normally and return what is expected.

#### 7 - Delete cookie in Insomnia and check if returns 401 error

```json
{ "error": "Unauthorized" }
```

--- 

### Adding Hooks

#### 1 - Let's add a global hook in server.ts

```js
// const app = fastify()

// Global Hook
app.addHook('preHandler', async (request) => {
	console.log(`[${request.method}] ${request.url}`)
})
```

#### 2 - Check hello and hello/db and o routes

* [GET] http://127.0.0.1:3333/hello  
[GET] http://127.0.0.1:3333/hello/db  

#### 3 - Comment out the hook and create one below pointing to check-session-id.ts

```js
// import
import { checkSessionId } from './middlewares/check-session-id.js'

// Global Hook
/* 
app.addHook('preHandler', async (request) => {
	console.log(`[${request.method}] ${request.url}`)
}) 
*/
app.addHook('preHandler', checkSessionId)
```

#### 4 - Check hello and hello/db routes again

* [GET] http://127.0.0.1:3333/hello  
[GET] http://127.0.0.1:3333/hello/db  

The result is

```json
{"error":"Unauthorized123"}
```

* This could be used to call methods that need to be called before all other routes.  
But it is not ideal for calling authentication as it would block all other routes.  

#### 5 - Remove check session id in server.ts  
* We won't go into these issues in depth now.

```json
// Remove or comment
// import { checkSessionId } from './middlewares/check-session-id.js'

// and
// app.addHook('preHandler', checkSessionId)
```

#### 6 - But if you add an addHook-preHandler inside a route, the scope will be that route. 
* Let's add it in transactions.ts  

```js
// export async function transactionsRoutes...

// Middleware to check if sessionId exists
app.addHook('preHandler', checkSessionId)
```

#### 7 - Remove preHandler from all get functions

```js
/* Remove 
{
    preHandler: [checkSessionId]
}
*/

// It goes back to being like this

// Select All
app.get('/', async (request) //...

// Select SUM
app.get('/summary', async (request) //...

// Select Unique 
app.get('/:id', async (request) //...
```

#### 8 - Test get routes again via Insomnia

* [GET] http://127.0.0.1:3333/transactions  
[GET] http://127.0.0.1:3333/transactions/transaction_id  
[GET] http://127.0.0.1:3333/transactions/summary  

The result should be

```json
{"error":"Unauthorized123"}
```

* But if you test it now   
[POST] http://127.0.0.1:3333/transactions

```json
{"error":"Unauthorized123"}
```
* Houston I have a problem!  
The solution is to separate routes that require authorization and those that do not.

#### 9 - Duplicate the transaction.ts file and rename one to public-transaction.ts and the other to private-transaction.ts

* In public-transaction.ts rename main function with public prefix

```js
export async function publicTransactionsRoutes //...
```

* Remove addHook-preHandler

```js
// Remove this
// Middleware to check if sessionId exists
app.addHook('preHandler', checkSessionId)
```

* Delete all query routes, keeping only the Insert route

* In private-transaction.ts rename main function with private prefix

```js
export async function privateTransactionsRoutes //...
```

* Delete Insert query route, keeping all the GET routes

#### 10 - Now just fix the import errors and separate the routes in server.ts

```js
// imports
import { publicTransactionsRoutes } from './routes/public-transactions.js'
import { privateTransactionsRoutes } from './routes/private-transactions.js'

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
```

* If more routes appear in the application from now on, just follow this approach

#### 11 - Delete the app.db, run the migration and test all routes again.

```sh
npm run knex -- migrate:latest     
npm run dev 
```
   
* [GET] http://127.0.0.1:3333/hello  
[GET] http://127.0.0.1:3333/hello/db  
[GET] http://127.0.0.1:3333/transactions  
[GET] http://127.0.0.1:3333/transactions/transaction_id  
[GET] http://127.0.0.1:3333/transactions/summary  

* Understand the insane amount of work involved in testing all the possibilities and then sending a bug-free API to production. Imagine it working with perhaps hundreds of routes. The chance of forgetting something, even when automating in Insomnia, is high.
That's why the next steps are to add automated tests.

--- 

### Adding Unit Tests

* Tests are for more than just making the application work.  
They give us confidence when it comes to maintaining the code and implementing new features.

There are three types of tests and we can think of them as a pyramid: 
- End-to-End Tests -> Simulates a user operating the application  
- Integration Tests -> Tests the communication between two or more functionalities  
- Unit Tests -> Tests one isolated functionality at a time  


* End to end tests:  
On the front-end: open the login page, type the text user@email.com in the email ID field, click the button, etc.  
On the back-end: HTTP calls, Authentication, WebSockets, etc.  

* In this example application, to make it easier to understand, we will focus on the easiest one, E2E Tests.

* The most widely used and famous testing framework is Jest. But we will use Vitest, which uses the same syntax but runs much faster.

#### 1 - Install Vitest

```sh
npm i vitest -D
```

#### 2 - Create a **__tests__** folder in app root and transactions.test.ts file with

```js
import { expect, test } from 'vitest';

test('User must create a new transaction', async () => {

    // Call HTTP POST /transactions
    const statusCode = 201;

    // test
    expect(201).toEqual(statusCode);
})
```

* There was probably an error in tsconfig.json complaining that it could not access this new folder.  
We will resolve this in the next step.

#### 3 - Adding **__tests__** folder in "exclude" section in tsconfig.json  

```json
"exclude": [
    "__tests__",
    "knexfile.ts",
    "db/migrations"
]
```

#### 4 - Running Vitest

```sh
npx vitest
```

#### 5 - Modify package.json, in scripts section to add

```json
"test": "vitest"
```

#### 6 - Running Vitest with simple

```sh
npm test
```

---  

### Modifying the application to use Supertest

* Supertest allows us to run the application during testing, without having to run it in normal execution mode.  
To do this, we must separate the application from the final part where we load the http server (app.listen...) so that Supertest only loads this first part.

#### 1 - Create a new file called **app.ts** and cut out all the contents of server.ts except the app.listen part

```js
import { env } from './validators/env.js'
//
import fastify from 'fastify'
import cookie from '@fastify/cookie'
//
import { helloRoute } from './routes/hello.js'
import { publicTransactionsRoutes } from './routes/public-transactions.js'
import { privateTransactionsRoutes } from './routes/private-transactions.js'

// The application
const app = fastify()

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
```

#### 2 - And Export the app instance

```js
// The application
export const app = fastify()
```

#### 3 - In server.ts import app and env

```js
// add imports
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
```

#### 4 - In app.ts remove unnecessary **env** import

```js
// Remove
import { env } from './validators/env.js'
```

#### 5 - Running the app. It should work normally.

#### 6 - Instal Supertest and your types

```sh
npm i supertest -D
npm i @types/supertest -D
```

---  

### Creating real app tests

#### 1 - Modify transactions.test.ts to supertest open and close the app

```js
import { app } from '../src/app';
import { beforeAll, afterAll, expect, test } from 'vitest';

// Setup the server before running tests
beforeAll(async () => {
    await app.ready();
})

// Teardown the server after running tests
afterAll(async () => {
    await app.close();
})

// test...
```

#### 2 - Modify to create a real transaction test

```js
// import
import supertest from 'supertest';

// tests
test('User must create a new transaction', async () => {

    await supertest(app.server)
        .post('/transactions')
        .send({
            title: 'Test Transaction',
            amount: 1000,
            type: 'credit'
        })
        .expect(201)
})
```

#### 3 - Running test

```sh
npm test
```

#### 4 - Categorizing the tests 

* Wrap all tests of a part of the application using describe.  
In addition to categorizing, it serves to isolate the test steps.  
The beforeAll, afterAll will occur within this describe.  

```js
describe('Transactions routes', () => {
    // beforeAll
    // afterAll
    // test 1
    // test 2 etc
})
```

#### 4 - Categorizing the tests 

* You can use either the **test** method or the **it** method.  
Both work the same way.  
The it method however serves as a part of the sentence, as in the requirements conventions.  
e.g. it should be able... = it('should be able ...  

```js
it('should be able to create a new transaction', async () => {

    await supertest(app.server)
        .post('/transactions')
        .send({
            title: 'Test Transaction',
            amount: 1000,
            type: 'credit'
        })
        .expect(201)
})
```

#### 5 - Testing

 * Note that the output sentence using describe + the convention in it makes much more sense.

```sh
npm test   
// Says
✓ Transactions routes > should be able to create a new transaction 
```

#### 6 - Add more route tests

Test all transactions 

```js
it('should be able to list all transactions', async () => {

    const newTransaction = {
        title: 'Test Transaction',
        amount: 1000,
        type: 'credit'
    }

    // insert
    const createTransaction = await supertest(app.server)
        .post('/transactions')
        .send(newTransaction)

    // get cookies
    const cookies = createTransaction.get('Set-Cookie') || []

    // list
    const listAllTransactions = await supertest(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

    // test content
    expect(listAllTransactions.body.transactions).toEqual([
        expect.objectContaining({
            title: newTransaction.title,
            amount: newTransaction.amount
        })
    ])
})
```

---  

### Database issues in testing

* Look in the database, in the transactions table and notice that records are being inserted whenever the tests are being executed.  
To solve this, they will create a separate bank just for testing.

#### 1 - Duplicate the .env file, renaming it to .env.test and modify the database name

```ini
# Node/App Environment - "test"
NODE_ENV="test"

# Application http port - 3333
HTTP_PORT=3333

# SQLite TEST database path - "./db/tests.db"
DATABASE_PATH="./db/tests.db"
```

* Add to .gitignore and duplicate as .env.test.example


#### 2 - Modify env.ts in validators

```js
// change
import "dotenv/config"
// to
import { config } from 'dotenv'
import { z } from 'zod'
// and add
// Checking the environment
if (process.env.NODE_ENV === 'test') {
    config({ path: '.env.test' })
} else {
    config()
}
```

#### 3 - Running tests

```sh
npm test
```
* The tests will fail. But check in the **db** folder that the **test.db** database has been created.  
The tests failed because the tables had not yet been created in this database.

#### 4 - Modify **transactions.test.ts** to run the migrations.

```js
// import
import { execSync } from 'node:child_process';
// and add beforeEach
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest';

// add

// Run before each test
beforeEach(async () => {
    // delete all tables, if exists
    execSync('npm run knex -- migrate:rollback --all')
    // create tables
    execSync('npm run knex -- migrate:latest')
})
```

---  

### Add other tests

#### 1 - Testing select unique

```js
it('should be able to get a specific transaction', async () => {

    const newTransaction = {
        title: 'Test Transaction',
        amount: 1000,
        type: 'credit'
    }

    // insert
    const createTransaction = await supertest(app.server)
        .post('/transactions')
        .send(newTransaction)

    // get cookies
    const cookies = createTransaction.get('Set-Cookie') || []

    // list all
    const listAllTransactions = await supertest(app.server)
        .get('/transactions')
        .set('Cookie', cookies)

    const transactionId = listAllTransactions.body.transactions[0].id

    // list unique
    const getTransaction = await supertest(app.server)
        .get(`/transactions/${transactionId}`)
        .set('Cookie', cookies)
        .expect(200)

    // test content
    expect(getTransaction.body).toEqual(
        expect.objectContaining({
            id: transactionId,
            title: newTransaction.title,
            amount: newTransaction.amount
        })
    )
})
```

#### 2 - Testing summary

```js
it('should be able to get summary', async () => {

    const newTransaction1 = {
        title: 'Test Transaction 1',
        amount: 1000,
        type: 'credit'
    }

    const newTransaction2 = {
        title: 'Test Transaction 2',
        amount: 500,
        type: 'debit'
    }

    // insert
    const createTransaction1 = await supertest(app.server)
        .post('/transactions')
        .send(newTransaction1)

    // get cookies
    const cookies = createTransaction1.get('Set-Cookie') || []

    await supertest(app.server)
        .post('/transactions')
        .set('Cookie', cookies)
        .send(newTransaction2)

    // list
    const getSummary = await supertest(app.server)
        .get('/transactions/summary')
        .set('Cookie', cookies)
        .expect(200)

    expect(getSummary.body.balance).toEqual(newTransaction1.amount - newTransaction2.amount)
})
```

---

### Compiling the project  

* We had already configured a shortcut for compilation in package.json ("compile": "npx tsc"), and we can run with **npm run compile**  
The javascript files were generated in the **dist** folder.  
* But the kenex files and migrations were excluded in the TypeScript configuration in the **tsconfig.json** file  
They will be needed if you want to create the database using migrations in production.

#### 1 - Modifying tsconfig.json  

Remove knexfile.ts and db/migrations from exclude at the end of tsconfig. Keep only \_\_tests__  
It will generate some errors in tsconfig.

```json
"exclude": [
"__tests__"
]
```

Comment the **rootDir** section and uncomment **rootDirs** and add all necessary sources

```json
"rootDirs": [
    "./src",
    "./db/migrations",
    "nexfile.ts"
]
```

#### 2 - Compile the project  

```sh
npm run compile 
```

#### 3 - Running compilede code  

* The server will run, but remember that it needs the .env and the database.

```sh
node ./dist/src/server.js    
```

#### 4 - Compile with tsup

* Another way to compile TypeScript is through the Tsup module.  
Let's install it  

```sh
npm i tsup -D  
```

#### 5 - Add another build command in **package.json** in the scripts section

```json
"build": "tsup src --format esm --out-dir build"
```

* Add build folder in .gitignore too  

```sh
# Build folder
build
```  

---  

### Deploy to Render Cloud

#### 1 - Create free Postgress database in Render, named rest-api-db

[Render Database](https://dashboard.render.com/new/database)

* Free databases in Render expires in 90 days  

#### 2 - Add new variable in  files

In .env, env.example, .env.test and .env.test.example  
```ini
# Database type - sqlite or pg
DATABASE_TYPE=better-sqlite3
```

In .env, env.example  
```ini
# Postgres database URL - e.g. postgresql://rest_api_db_... 
DATABASE_URL=
```

#### 3 - Modify the env.ts file in the validators to add this new variables

```js
// add
DATABASE_TYPE: z.enum(['better-sqlite3', 'pg'])
// and add
DATABASE_URL: z.optional(z.string())
```

#### 4 - Install Postgress driver and types

```sh
npm i pg
npm i @types/pg -D
```

#### 5 - Modify database.ts to change db client and connection

```js
// change 
client: 'better-sqlite3',
// to
client: env.DATABASE_TYPE,

// and change
connection: {
    filename: env.DATABASE_PATH
},
// to
connection:
    env.DATABASE_TYPE !== 'pg' ?
        { filename: env.DATABASE_PATH } :
        env.DATABASE_URL,
```

#### 6 - Specify the minimum node version in package.json and add start in scripts

See more details at [Render node version](https://render.com/docs/node-version)  

```js
"engines": {
    "node": ">=22.12.0"
},
// in scripts
"start": "node build/src/server.js",
```  

#### 7 - Modify server.ts

```js
// in
app.listen({ port: env.HTTP_PORT }, // ...
// add host
app.listen({
	port: env.HTTP_PORT,
	host: ("RENDER" in process.env) ? '0.0.0.0' : 'localhost'
}, // ...
```

#### 8 - Create a tsup.config.ts file in root folder to add a multiple sources and modify build command in scripts

```js
import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src', 'knexfile.ts'],
    splitting: false,
    sourcemap: true,
    clean: true,
})
```

* Remove **src** in (tsup ~~src~~ --format etc)

```json
"build": "tsup --format esm --out-dir build",
```



#### 9 - Commit changes to Github

#### 10 - In Render Cloud, copy **Internal Database URL** of the database you created previously and past in your notpad

#### 11 - In Render Cloud Dashboard, click in **+New > Web Service**

* Click in GitHub icon and authorize to access your repositories  
Select your repo  
* In Language select Node  
* In the region, put the same one in which the database was created
* Build command

```sh
npm install && npm run build && npm run knex -- migrate:latest
```

* Start Command

Environments

* Select free plan

* Create in your desktop .env with values

```ini
# Node/App Environment - e.g. "development", "test" or "production"
NODE_ENV="production"

# Database type - better-sqlite3 or pg
DATABASE_TYPE=pg

# Postgres database URL (optional) - e.g. postgresql://rest_api_db_... 
DATABASE_URL=postgresql://rest_api_db... etc
```

---

### Environments in Insomnia

#### 1 - Create two sub Environments with url variable in json format

* Dev

```json
{
	"url": "http://localhost:3333"
}
```

* Prod

```json
{
	"url": "https://your-prod-url.onrender.com"
}
```

#### 2 - Adding prefix variable in all routes   
* _URL.url/hello etc

#### 3 - Test all routes in production using Insomnia

All done!  
🫡

