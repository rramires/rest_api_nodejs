import knex, { Knex } from 'knex';

export const knexConn: Knex = knex({
    client: 'better-sqlite3',
    connection: {
        filename: './db/app.db'
    },
    useNullAsDefault: true
});

