import pool from '@/lib/pg-db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
            return NextResponse.json({ error: 'No database configured' }, { status: 500 });
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS site_content (
                key VARCHAR(50) PRIMARY KEY,
                data JSONB
            )
        `);
        return NextResponse.json({ status: 'Database Initialized Successfully' });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
