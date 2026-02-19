import nodeIcal from 'node-ical';

export async function fetchExternalBookings(icalUrl: string) {
    try {
        const data = await nodeIcal.async.fromURL(icalUrl);
        const bookings = [];

        for (const k in data) {
            const event = data[k];
            if (event.type === 'VEVENT') {
                if (event.start && event.end) {
                    bookings.push({
                        start: new Date(event.start),
                        end: new Date(event.end),
                        summary: event.summary || 'External Booking'
                    });
                }
            }
        }
        return bookings;
    } catch (error) {
        console.error('Error parsing iCal:', error);
        return [];
    }
}
