import { NextResponse } from 'next/server';

// This will be replaced with real Google Ads API logic once keys are provided
export async function GET() {
    try {
        // Mock campaigns
        const campaigns = [
            { id: '1', name: 'Eilat Luxury Villas - Search', status: 'ENABLED', clicks: 1240, impressions: 25000, cost: 450.5, ctr: 4.96 },
            { id: '2', name: 'Penthouse Rentals - Display', status: 'PAUSED', clicks: 450, impressions: 120000, cost: 230.2, ctr: 0.38 },
            { id: '3', name: 'International Tourists - Video', status: 'ENABLED', clicks: 890, impressions: 45000, cost: 120.8, ctr: 1.98 },
        ];

        return NextResponse.json(campaigns);
    } catch (error) {
        console.error('Google Ads API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, status } = await req.json();

        // In a real implementation, we would call the Google Ads API here
        console.log(`Updating campaign ${id} to status ${status}`);

        return NextResponse.json({ success: true, id, status });
    } catch (error) {
        console.error('Google Ads Update Error:', error);
        return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
    }
}
