# rest_api_node
Rest API - NodeJs, using Fastify, TypeScript, KnexJs, Vitest, etc

### Initial configuration and module installation

#### 1 - Init the project:
```sh
npm init -y     
```

#### 2 - Install TypeScript and types, following this instructions:

[Install and Configure TypeScript](https://github.com/rramires/typescript_fundamentals?tab=readme-ov-file#typescript_fundamentals)

#### 3 - Install Fastify
```sh
npm i fastify     
```

#### 4 - Rename or create server.ts and add Fastify Hello:
```javascript
import fastify from "fastify";

const app = fastify();

app.get('/hello', async () => {
    return "Hello from Fastify!";
});

app.listen({ port: 3333 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is running at ${address}`);
});    
```

#### 5 - Modify package.json, in scripts section:

```json
"dev": "tsx watch src/server.ts", 
```

#### 6 - Running the App:

```sh
npm run dev   
```

#### 7 - Access via HTTPie or in your browser:

```sh
http GET localhost:3333/hello    
```

