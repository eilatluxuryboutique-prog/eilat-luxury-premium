import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const property = await Property.findById(id);

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        // Check ownership or admin role
        if (property.ownerId !== session.userId && session.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await Property.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Delete Property Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        await dbConnect();

        const property = await Property.findById(id);
        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        // Only owner can edit, unless it's an admin changing status/blockages
        const isOwner = property.ownerId === session.userId;
        const isAdmin = session.role === 'admin';

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // If not admin, pick only allowed fields
        let updateData = body;
        if (!isAdmin) {
            const { status, ...rest } = body; // Non-admins can't change status (active/suspended) if we implement it
            updateData = rest;
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true }
        );

        return NextResponse.json({ success: true, property: updatedProperty });
    } catch (error) {
        console.error('Update Property Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
