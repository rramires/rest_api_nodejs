import { env } from './validators/env.js'
import knex, { Knex } from 'knex'

export const config: Knex.Config = {
    client: env.DATABASE_TYPE,
    connection:
        env.DATABASE_TYPE !== 'pg' ?
            { filename: env.DATABASE_PATH } :
            env.DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
        directory: `./db/migrations`,
        extension: 'ts'
    }
}

export const knexConn: Knex = knex(config);

