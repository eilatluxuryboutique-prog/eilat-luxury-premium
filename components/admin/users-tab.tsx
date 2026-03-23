'use client';

import { useState, useEffect } from 'react';
import { User, Shield, ShieldAlert, Trash2, Search, UserCheck, UserX } from 'lucide-react';

export default function UsersTab() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.users) setUsers(data.users);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (userId: string, update: any) => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ...update })
            });

            if (res.ok) {
                setUsers(prev => prev.map(u => u._id === userId ? { ...u, ...update } : u));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action is irreversible.')) return;

        try {
            const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(prev => prev.filter(u => u._id !== userId));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-xl border border-zinc-100 shadow-sm">
                <div className="relative w-full max-w-md">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="חיפוש משתמשים לפי שם או אימייל..."
                        className="w-full bg-white border border-zinc-200 rounded-lg py-2 pr-10 pl-4 text-zinc-900 text-sm focus:border-gold outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-zinc-500 font-medium">
                    סה"כ: {filteredUsers.length} משתמשים
                </div>
            </div>

            <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                        <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold border-b border-zinc-100">
                            <tr>
                                <th className="px-6 py-4">משתמש</th>
                                <th className="px-6 py-4">תפקיד</th>
                                <th className="px-6 py-4">סטטוס</th>
                                <th className="px-6 py-4">תאריך הרשמה</th>
                                <th className="px-6 py-4 text-left">פעולות</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-zinc-400 italic">טוען נתונים...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-zinc-400 italic">לא נמצאו משתמשים</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-zinc-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold border border-gold/20">
                                                    {(user.name || 'U')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-zinc-900 font-bold">{user.name || 'Unknown'}</div>
                                                    <div className="text-xs text-zinc-400 font-mono">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {user.role === 'admin' ? (
                                                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-bold">
                                                        <Shield size={12} /> מנהל
                                                    </span>
                                                ) : user.role === 'host' ? (
                                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">מארח</span>
                                                ) : (
                                                    <span className="bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded text-xs font-bold">אורח</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.status === 'suspended' ? (
                                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-bold">
                                                    <ShieldAlert size={12} /> מושעה
                                                </span>
                                            ) : (
                                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-bold">
                                                    <UserCheck size={12} /> פעיל
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400 text-xs font-mono">
                                            {new Date(user.createdAt || Date.now()).toLocaleDateString('he-IL')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {user.status === 'suspended' ? (
                                                    <button
                                                        onClick={() => handleUpdateUser(user._id, { status: 'active' })}
                                                        className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                                                        title="ביטול השעיה"
                                                    >
                                                        <UserCheck size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUpdateUser(user._id, { status: 'suspended' })}
                                                        className="p-2 hover:bg-orange-50 rounded-lg text-orange-500 transition-colors"
                                                        title="השעיית משתמש"
                                                    >
                                                        <UserX size={18} />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                                                    title="מחיקת משתמש"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
