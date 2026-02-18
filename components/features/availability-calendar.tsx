'use client';

import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isSameDay } from 'date-fns';
import { he } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { Loader2 } from 'lucide-react';

interface AvailabilityCalendarProps {
    propertyId: string;
    onDateSelect?: (range: { from: Date; to: Date } | undefined) => void;
    className?: string;
}

export default function AvailabilityCalendar({ propertyId, onDateSelect, className }: AvailabilityCalendarProps) {
    const [bookedDates, setBookedDates] = useState<Date[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRange, setSelectedRange] = useState<{ from: Date; to: Date } | undefined>();

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const res = await fetch(`/api/properties/${propertyId}/availability`);
                const data = await res.json();

                if (data.unavailableDates) {
                    const dates: Date[] = [];
                    data.unavailableDates.forEach((range: { start: string, end: string }) => {
                        let current = new Date(range.start);
                        const end = new Date(range.end);
                        while (current <= end) {
                            dates.push(new Date(current));
                            current.setDate(current.getDate() + 1);
                        }
                    });
                    setBookedDates(dates);
                }
            } catch (error) {
                console.error('Failed to load calendar', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (propertyId) {
            fetchAvailability();
        }
    }, [propertyId]);

    const handleSelect = (range: any) => {
        // Range can be undefined if deselecting
        setSelectedRange(range);
        if (onDateSelect) {
            if (range?.from && range?.to) {
                onDateSelect(range);
            } else {
                onDateSelect(undefined);
            }
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gold" /></div>;
    }

    return (
        <div className={`p-4 bg-[#1a1a1a] rounded-xl border border-white/10 ${className}`} dir="ltr">
            <style>{`
                .rdp { --rdp-accent-color: #D4AF37; --rdp-background-color: #2a2a2a; color: white; margin: 0; }
                .rdp-day_selected:not([disabled]) { color: black; font-weight: bold; }
                .rdp-day_today { color: #D4AF37; font-weight: bold; }
                .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: rgba(255,255,255,0.1); }
            `}</style>
            <DayPicker
                mode="range"
                selected={selectedRange}
                onSelect={handleSelect}
                disabled={bookedDates}
                numberOfMonths={1}
                pagedNavigation
                locale={he}
                modifiersStyles={{
                    disabled: { color: '#555', textDecoration: 'line-through' }
                }}
            />
            <div className="mt-4 flex items-center justify-between text-sm text-neutral-400 px-2" dir="rtl">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>
                    <span>פנוי / נבחר</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#555]"></div>
                    <span>תפוס</span>
                </div>
            </div>
        </div>
    );
}
