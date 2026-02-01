import { Pool } from 'pg';

// Global declaration for hot reloading in dev
declare global {
    var pgPool: Pool | undefined;
}

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
    pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });
} else {
    if (!global.pgPool) {
        global.pgPool = new Pool({
            connectionString,
            ssl: { rejectUnauthorized: false }
        });
    }
    pool = global.pgPool;
}

export default pool;
