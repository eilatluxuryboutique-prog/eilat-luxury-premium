import { useState, useEffect } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Users, Eye, ShoppingCart } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function AnalyticsTab() {
    const [stats, setStats] = useState({
        revenue: 0,
        profit: 0,
        bookings: 0,
        properties: 0,
        guests: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => {
                if (data.stats) setStats(data.stats);
                setLoading(false);
            })
            .catch(err => {
                console.error("Stats fetch error", err);
                setLoading(false);
            });
    }, []);

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue 2026',
                data: [12000, 19000, 3000, 5000, 2000, stats.revenue > 0 ? stats.revenue : 25000],
                borderColor: '#D4AF37',
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { color: 'white' }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                ticks: { color: 'rgba(255,255,255,0.5)' },
                grid: { color: 'rgba(255,255,255,0.1)' }
            },
            x: {
                ticks: { color: 'rgba(255,255,255,0.5)' },
                grid: { color: 'rgba(255,255,255,0.1)' }
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                            <DollarSign size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-green-400 text-sm">
                            <ArrowUpRight size={16} />
                            <span>+12.5%</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-white/50 text-sm">Total Revenue</p>
                        <h3 className="text-2xl font-bold">₪{stats.revenue.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                            <ShoppingCart size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-green-400 text-sm">
                            <ArrowUpRight size={16} />
                            <span>+8.2%</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-white/50 text-sm">Total Bookings</p>
                        <h3 className="text-2xl font-bold">{stats.bookings}</h3>
                    </div>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                            <Users size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-red-400 text-sm">
                            <ArrowDownRight size={16} />
                            <span>-2.1%</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-white/50 text-sm">Active Guests</p>
                        <h3 className="text-2xl font-bold">{stats.guests}</h3>
                    </div>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gold/20 rounded-xl text-gold">
                            <Eye size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-green-400 text-sm">
                            <ArrowUpRight size={16} />
                            <span>+24%</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-white/50 text-sm">Profit (10%)</p>
                        <h3 className="text-2xl font-bold text-gold">₪{Math.round(stats.profit).toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-bold mb-6">Revenue Overview</h3>
                    <div className="h-[300px] w-full">
                        <Line options={options} data={data} />
                    </div>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-white/5">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-sm">
                                    Guest
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">New Booking</h4>
                                    <p className="text-xs text-white/50">2 minutes ago</p>
                                </div>
                                <div className="text-gold font-bold text-sm">+₪2,400</div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-colors">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
}
