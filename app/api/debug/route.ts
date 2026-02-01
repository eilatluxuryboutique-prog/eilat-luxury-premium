import { NextResponse } from 'next/server';
import pool from '@/lib/pg-db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        if (!pool) {
            return NextResponse.json({ error: 'Pool not initialized' }, { status: 500 });
        }

        if (action === 'force-dog') {
            const dogUrl = 'https://res.cloudinary.com/demo/video/upload/dog.mp4';
            const newData = {
                hero: { videoUrl: dogUrl },
                theme: { logoColor: 'text-yellow-400', primaryColor: '#3b82f6' }
            };

            await pool.query(
                `INSERT INTO site_content (key, data, updated_at) 
                 VALUES ($1, $2, NOW()) 
                 ON CONFLICT (key) DO UPDATE SET data = $2, updated_at = NOW()`,
                ['site_content', newData]
            );
            return NextResponse.json({ message: 'Forced Dog Video', url: dogUrl });
        }

        const res = await pool.query("SELECT * FROM site_content");
        return NextResponse.json({
            rowCount: res.rows.length,
            rows: res.rows,
            env: {
                hasPostgresUrl: !!process.env.POSTGRES_URL,
                hasDbUrl: !!process.env.DATABASE_URL
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
