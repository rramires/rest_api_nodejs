import { env } from './validators/env.js';
import knex, { Knex } from 'knex';

export const config: Knex.Config = {
    client: 'better-sqlite3',
    connection: {
        filename: env.DATABASE_PATH
    },
    useNullAsDefault: true,
    migrations: {
        directory: `./db/migrations`,
        extension: 'ts'
    }
}

export const knexConn: Knex = knex(config);

