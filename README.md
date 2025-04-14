# rest_api_node

Rest API - NodeJs, using Fastify, TypeScript, KnexJs, Vitest, etc

### Initial configuration and module installation

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
and
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

```json
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

```javascript
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
import knex, { Knex } from 'knex';

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

export const knexConn: Knex = knex(config);
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

#### 10 - Adding table in migration

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

#### 11 - Execute migration

```sh
npm run knex -- migrate:latest 
```

#### 12 - Install SQLite Viewer extension  

[SQLite Viewer](https://marketplace.visualstudio.com/items?itemName=qwtel.sqlite-viewer)

* After installing, click on app.db and see the table **transactions** created by migration and the auxiliary tables

#### 13 - Rollback migration

```sh
npm run knex -- migrate:rollback
``` 

* Go back to SQL Viewer, reload and see that the transactions table has been deleted.

#### 14 - Add a new migration to create a new field

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
#### 15 - View the creation in SQLite Viewer

* Note: It is not necessary to rollback to create the new field. In this case, rollback was done for testing(or learning) purposes only.
* Note: The session_id field was created at the end and not after the id, despite being specified in the migration. This is because SQLite does not support it. Other databases such as MySQL, Postgress etc would probably support it.

---
