'use client';

import { Plane, PlaneLanding, PlaneTakeoff } from 'lucide-react';
import { useState, useEffect } from 'react';

const FLIGHTS = [
    { id: 'IZ843', time: '14:30', airline: 'Arkia', dest: 'Tel Aviv', status: 'Landed', type: 'arrival' },
    { id: '6H451', time: '15:10', airline: 'Israir', dest: 'Haifa', status: 'On Time', type: 'arrival' },
    { id: 'IZ844', time: '16:00', airline: 'Arkia', dest: 'Tel Aviv', status: 'Boarding', type: 'departure' },
    { id: 'W6232', time: '16:45', airline: 'Wizz', dest: 'Rome', status: 'Delayed', type: 'departure' },
];

export default function FlightBoard() {
    const [flights, setFlights] = useState(FLIGHTS);

    // Simulate updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly update statuses for "Live" feel
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black text-yellow-500 font-mono p-4 rounded-xl border border-white/20 text-xs overflow-hidden w-full max-w-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-white/20 pb-2">
                <Plane size={16} className="text-white" />
                <span className="text-white font-bold uppercase">Ramon Airport (ETM) - Live</span>
            </div>

            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-4 text-white/50 text-[10px] uppercase">
                    <span>Flight</span>
                    <span>Time</span>
                    <span>Dest/Orig</span>
                    <span className="text-right">Status</span>
                </div>
                {flights.map(f => (
                    <div key={f.id} className="grid grid-cols-4 items-center border-b border-white/5 pb-1">
                        <div className="flex items-center gap-1">
                            {f.type === 'arrival' ? <PlaneLanding size={10} /> : <PlaneTakeoff size={10} />}
                            <span className="font-bold">{f.id}</span>
                        </div>
                        <span>{f.time}</span>
                        <span>{f.dest}</span>
                        <span className={`text-right font-bold ${f.status === 'Delayed' ? 'text-red-500 animate-pulse' : f.status === 'Landed' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {f.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
