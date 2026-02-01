
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// Force dynamic requirement for file uploads
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + '-' + file.name.replace(/\s+/g, '-');

        // Ensure upload dir exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // Construct public URL
        const secure_url = `/uploads/${filename}`;

        // Save to registry logic (duplicated here to ensure atomicity, or call registry API)
        // For simplicity, we'll return the info and let frontend call the registry or do it here.
        // Let's do it here for robustness.

        const mediaItem = {
            public_id: filename,
            format: file.type.split('/')[1] || 'unknown',
            secure_url: secure_url,
            created_at: new Date().toISOString(),
            bytes: file.size,
            resource_type: file.type.startsWith('video') ? 'video' : 'image'
        };

        // Append to local registry
        const registryPath = path.join(process.cwd(), 'data', 'media.json');
        let registry = [];
        try {
            const data = fs.readFileSync(registryPath, 'utf8');
            registry = JSON.parse(data);
        } catch (e) {
            // file might not exist yet
        }

        registry = [mediaItem, ...registry];
        await writeFile(registryPath, JSON.stringify(registry, null, 2));

        return NextResponse.json({ success: true, resource: mediaItem });
    } catch (error) {
        console.error('Upload failed:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
