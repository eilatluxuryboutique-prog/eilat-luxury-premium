import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'ads.json');

export async function GET() {
    try {
        const fileContent = await fs.readFile(dataFilePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return NextResponse.json(data);
    } catch (error) {
        // If file missing, return specific error or create default?
        // For now return empty or error
        console.error('Failed to read ads.json:', error);
        return NextResponse.json([], { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Validation could go here
        await fs.writeFile(dataFilePath, JSON.stringify(body, null, 2), 'utf-8');
        return NextResponse.json({ success: true, data: body });
    } catch (error) {
        console.error('Failed to save ads.json:', error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
