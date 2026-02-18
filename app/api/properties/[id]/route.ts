import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        try {
            await dbConnect();
            const property = await Property.findById(id);
            if (!property) {
                return NextResponse.json({ error: "Property not found" }, { status: 404 });
            }
            return NextResponse.json({ property: { ...property.toJSON(), id: property._id.toString() } });
        } catch (dbError) {
            // Fallback logic could go here if we want to search mock data by ID
            // But for specific ID, it's likely a real DB request
            throw dbError;
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session || (session.role !== 'host' && session.role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        await dbConnect();

        // Security: Ensure owner matches session (unless admin)
        const existing = await Property.findById(id);
        if (!existing) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        if (session.role !== 'admin' && existing.ownerId !== session.userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updated = await Property.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json({ success: true, property: updated });

    } catch (error) {
        console.error("Update failed", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session || (session.role !== 'host' && session.role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await dbConnect();

        const existing = await Property.findById(id);
        if (!existing) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        if (session.role !== 'admin' && existing.ownerId !== session.userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await Property.findByIdAndDelete(id);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Delete failed", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
