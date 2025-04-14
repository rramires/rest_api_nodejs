import knex, { Knex } from 'knex';

export const config: Knex.Config = {
    client: 'better-sqlite3',
    connection: {
        filename: String(process.env.DATABASE_URL)
    },
    useNullAsDefault: true,
    migrations: {
        directory: `./db/migrations`,
        extension: 'ts'
    }
}

export const knexConn: Knex = knex(config);

