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
            );
            
            CREATE TABLE IF NOT EXISTS properties (
                id SERIAL PRIMARY KEY,
                owner_id VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                images TEXT[],
                location VARCHAR(255),
                amenities TEXT[],
                rating DECIMAL(2, 1) DEFAULT 0,
                guests INTEGER DEFAULT 2,
                rooms INTEGER DEFAULT 1,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        return NextResponse.json({ status: 'Database Initialized Successfully' });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
