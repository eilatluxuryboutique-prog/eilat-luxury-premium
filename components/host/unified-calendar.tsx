'use client';

import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function UnifiedCalendar({ properties }: { properties: any[] }) {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllEvents = async () => {
            const allEvents = [];
            for (const property of properties) {
                try {
                    const res = await fetch(`/api/properties/${property._id || property.id}/availability`);
                    const data = await res.json();

                    if (data.unavailableDates) {
                        data.unavailableDates.forEach((d: any) => {
                            let color = '#22c55e'; // Green (Internal)
                            let title = `Booking: ${property.title}`;

                            if (d.source) {
                                if (d.source.toLowerCase().includes('airbnb')) {
                                    color = '#ff5a5f'; // Airbnb Red
                                    title = `Airbnb: ${property.title}`;
                                } else if (d.source.toLowerCase().includes('booking')) {
                                    color = '#003580'; // Booking Blue
                                    title = `Booking.com: ${property.title}`;
                                } else {
                                    color = '#888'; // Other
                                    title = `${d.source}: ${property.title}`;
                                }
                            } else if (d.reason === 'manual_block') {
                                color = '#555'; // Grey (Blocked)
                                title = `Blocked: ${property.title}`;
                            }

                            allEvents.push({
                                title,
                                start: new Date(d.start),
                                end: new Date(d.end),
                                color,
                                propertyId: property._id
                            });
                        });
                    }
                } catch (e) {
                    console.error("Error fetching calendar", e);
                }
            }
            setEvents(allEvents);
            setLoading(false);
        };

        if (properties.length > 0) fetchAllEvents();
    }, [properties]);

    const eventStyleGetter = (event: any) => {
        return {
            style: {
                backgroundColor: event.color,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    if (loading) return <div className="text-white text-center p-10">טוען יומנים...</div>;

    return (
        <div className="bg-white rounded-xl p-4 h-[600px] text-black">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day']}
                messages={{
                    next: "הבא",
                    previous: "הקודם",
                    today: "היום",
                    month: "חודש",
                    week: "שבוע",
                    day: "יום"
                }}
            />
        </div>
    );
}
