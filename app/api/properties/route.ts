import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    let body: any = {};

    try {
        const session = await getSession();
        if (!session || (session.role !== 'host' && session.role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        body = await req.json();

        // Basic Validation
        if (!body.title || !body.price) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const ownerId = session.userId;

        try {
            await dbConnect();

            const property = await Property.create({
                ...body,
                ownerId,
                isDemo: false
            });

            return NextResponse.json({ success: true, property }, { status: 201 });

        } catch (dbError) {
            console.error("MongoDB Operation Failed:", dbError);
            throw dbError; // Trigger fallback
        }

    } catch (error: any) {
        console.warn('DB Failed, using Fallback Demo Mode:', error);

        const demoProperty = {
            id: 'demo_' + Date.now(),
            ...body,
            title: body.title || 'Untitled Property',
            price: body.price || 0,
            type: body.type || 'apartment',
            createdAt: new Date(),
            ownerId: 'demo_user',
            isDemo: true
        };

        return NextResponse.json({
            success: true,
            property: demoProperty,
            message: "Property created (Demo Mode - Database not configured)",
            isDemo: true
        }, { status: 201 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const ownerId = searchParams.get('ownerId');
        const type = searchParams.get('type');
        const id = searchParams.get('id');

        let dbProperties: any[] = [];
        let mockProperties: any[] = [];

        // 1. Fetch from DB
        try {
            await dbConnect();
            let query: any = {};

            // Only query DB if ID is valid ObjectId
            if (id) {
                if (id.match(/^[0-9a-fA-F]{24}$/)) {
                    query._id = id;
                } else {
                    // ID provided but not valid ObjectId -> likely a mock ID
                    // Skip DB query for this specific ID search
                }
            }

            if (ownerId) query.ownerId = ownerId;
            if (type) query.type = type;

            // Only execute DB query if we didn't rule it out (e.g. searching for "h1" in DB)
            const shouldQueryDB = !id || (id && id.match(/^[0-9a-fA-F]{24}$/));

            if (shouldQueryDB) {
                const docs = await Property.find(query).sort({ createdAt: -1 }).lean();
                dbProperties = docs.map((p: any) => ({
                    ...p,
                    id: p._id.toString(),
                    _id: undefined,
                    pricePerNight: p.price
                }));
            }
        } catch (e) {
            console.error("DB Fetch Error", e);
        }

        // 2. Fetch from Mock Data
        try {
            const { properties } = await import('@/lib/mock-data');
            let filtered = properties;

            if (id) {
                filtered = filtered.filter(p => p.id === id);
            }
            if (type) {
                filtered = filtered.filter(p => p.type === type);
            }
            if (ownerId) {
                // If filtering by owner, mock data usually doesn't match unless we assign 'demo_user'
                // For "My Properties", users usually see their localStorage demos (client side).
                // The API shouldn't return global mocks as "My Properties" unless they own them.
                // so if ownerId is set, mock properties are effectively 0 unless we assume mocks belong to everyone (which is confusing).
                // We'll return empty mocks if ownerId is specific.
                filtered = [];
            }

            mockProperties = filtered;
        } catch (e) {
            console.error("Mock Fetch Error", e);
        }

        // 3. Merge
        const allProperties = [...dbProperties, ...mockProperties];

        if (id) {
            if (allProperties.length > 0) {
                return NextResponse.json({ property: allProperties[0] });
            } else {
                return NextResponse.json({ error: 'Property not found' }, { status: 404 });
            }
        }

        return NextResponse.json({ properties: allProperties });

    } catch (error) {
        console.error("Critical API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
