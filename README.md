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